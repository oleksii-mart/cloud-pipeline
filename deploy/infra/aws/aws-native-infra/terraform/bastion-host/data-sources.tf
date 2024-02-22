/*
===============================================================================
  Common
===============================================================================
*/
data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_region" "current" {}

data "aws_vpc" "this" {
  id = var.vpc_id
}

data "aws_ami" "eks_ami" {
  owners = ["amazon"]

  filter {
    name   = "name"
    values = ["amazon-eks-node-1.28-v20240213"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }
}

