/*
===============================================================================
  AWS EKS cluster
===============================================================================
*/
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.4.0"

  cluster_name    = local.cluster_name
  cluster_version = var.eks_cluster_version
  create_iam_role = false
  iam_role_arn    = aws_iam_role.eks_cluster_execution.arn

  vpc_id                         = data.aws_vpc.this.id
  subnet_ids                     = data.aws_subnets.this.ids
  authentication_mode            = "CONFIG_MAP"
  cluster_endpoint_public_access = false

  cluster_additional_security_group_ids = concat(
    var.additional_security_group_ids, [module.internal_cluster_access_sg.security_group_id]
  )

  cluster_addons = {
    coredns = {
      most_recent = true
      configuration_values = jsonencode({
        replicaCount = 3
        nodeSelector : local.eks_system_node_labels
      })
    }
  }

  # External encryption key
  create_kms_key = false
  cluster_encryption_config = {
    resources        = ["secrets"]
    provider_key_arn = module.kms_eks.key_arn
  }

  eks_managed_node_group_defaults = {
    ami_type               = "AL2_x86_64"
    create_iam_role        = false
    iam_role_arn           = aws_iam_role.eks_cp_system_node_execution.arn
    vpc_security_group_ids = [module.internal_cluster_access_sg.security_group_id]
    subnet_ids             = data.aws_subnets.this.ids
    metadata_options = {
      "http_endpoint" : "enabled",
      "http_put_response_hop_limit" : 1,
      "http_tokens" : "optional"
    }
  }

  eks_managed_node_groups = local.system_node_groups

  cluster_enabled_log_types              = ["audit", "api", "authenticator", "scheduler", "controllerManager"]
  cloudwatch_log_group_retention_in_days = var.eks_cloudwatch_logs_retention_in_days
  cloudwatch_log_group_kms_key_id        = module.kms_eks.key_arn
  tags                                   = local.tags
}

module "eks-aws-auth" {
  source  = "terraform-aws-modules/eks/aws//modules/aws-auth"
  version = "20.4.0"

  manage_aws_auth_configmap = true

  aws_auth_roles = concat([
    {
      rolearn  = aws_iam_role.eks_cp_system_node_execution.arn
      username = "system:node:{{EC2PrivateDNSName}}"
      groups = [
        "system:bootstrappers",
        "system:nodes",
      ]
    },
    {
      rolearn  = aws_iam_role.eks_cp_worker_node_execution.arn
      username = "system:node:{{EC2PrivateDNSName}}"
      groups = [
        "system:bootstrappers",
        "system:nodes",
      ]
    }
    ],
    local.sso_additional_role_mapping
  )
}

##############################################################
#       Amazon CloudWatch Observability EKS add-on
##############################################################
resource "aws_eks_addon" "cw_observability" {
  addon_name   = "amazon-cloudwatch-observability"
  cluster_name = module.eks.cluster_name

  depends_on = [
    aws_cloudwatch_log_group.cw_application, aws_cloudwatch_log_group.cw_dataplane, aws_cloudwatch_log_group.cw_host,
    aws_cloudwatch_log_group.cw_performance
  ]
}

##############################################################
#       AWS Load Balancer Controller add-on
##############################################################

resource "helm_release" "alb-controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  version    = "1.7.1"


  set {
    name  = "region"
    value = data.aws_region.current.id
  }

  set {
    name  = "vpcId"
    value = data.aws_vpc.this.id
  }

  set {
    name  = "rbac.create"
    value = "true"
  }

  set {
    name  = "serviceAccount.create"
    value = "true"
  }

  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = module.aws_lbc_addon_sa_role.iam_role_arn
  }


  set {
    name  = "nodeSelector.cloud-pipeline/node-group-type"
    value = "system"
  }

  set {
    name  = "clusterName"
    value = module.eks.cluster_name
  }

  set {
    name  = "enableServiceMutatorWebhook"
    value = "false"
  }
}

