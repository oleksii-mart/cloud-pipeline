# Copyright 2017-2019 EPAM Systems, Inc. (https://www.epam.com/)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import logging
from datetime import datetime

from mock import Mock, MagicMock

from pipeline.hpc.engine.gridengine import GridEngineJob
from pipeline.hpc.host import MemoryHostStorage
from pipeline.hpc.pipe import CloudPipelineWorkerValidator, CloudPipelineWorkerValidatorHandler
from utils import assert_first_argument_contained, assert_first_argument_not_contained

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s [%(threadName)s] [%(levelname)s] %(message)s')

HOST1 = 'HOST-1'
HOST2 = 'HOST-2'
HOST3 = 'HOST-3'
HOST1_RUN_ID = '1'
HOST2_RUN_ID = '2'
HOST3_RUN_ID = '3'
host_run_id_dict = {
    HOST1: HOST1_RUN_ID,
    HOST2: HOST2_RUN_ID,
    HOST3: HOST3_RUN_ID,
}

now = datetime(2018, 12, 21, 11, 10, 00)

executor = Mock()
host_storage = MemoryHostStorage()
grid_engine = Mock()
api = Mock()
scale_down_handler = Mock()
common_utils = Mock()
clock = Mock()
worker_validator_handlers = [
    CloudPipelineWorkerValidatorHandler(api=api, common_utils=common_utils),
    grid_engine
]
worker_validator = CloudPipelineWorkerValidator(cmd_executor=executor, api=api, host_storage=host_storage,
                                                grid_engine=grid_engine, scale_down_handler=scale_down_handler,
                                                handlers=worker_validator_handlers,
                                                common_utils=common_utils, dry_run=False)


def setup_function():
    host_storage.clear()
    for host in [HOST1, HOST2, HOST3]:
        host_storage.add_host(host)
    api.load_run = MagicMock(return_value={'status': 'RUNNING'})
    api.load_run_efficiently = MagicMock(return_value={'status': 'RUNNING'})
    api.stop_run = MagicMock()
    grid_engine.is_valid = MagicMock(side_effect=[True, False, True])
    grid_engine.get_jobs = MagicMock(return_value=[])
    grid_engine.kill_jobs = MagicMock()
    common_utils.get_run_id_from_host = MagicMock(side_effect=host_run_id_dict.get)
    clock.now = MagicMock(return_value=now)


def test_stopping_hosts_that_are_invalid_in_grid_engine():
    worker_validator.validate()

    assert sorted([HOST1, HOST3]) == sorted(host_storage.load_hosts())


def test_stopping_invalid_worker_pipeline():
    worker_validator.validate()

    api.stop_run.assert_called_with(HOST2_RUN_ID)
    assert api.stop_run.call_count == 1


def test_force_killing_invalid_host_jobs():
    jobs = [GridEngineJob(id='1', root_id=1, name='', user='', state='', datetime='', hosts=[HOST2])]
    grid_engine.get_jobs = MagicMock(return_value=jobs)

    worker_validator.validate()

    grid_engine.kill_jobs.assert_called_with(jobs, force=True)


def test_stopping_dead_worker_hosts():
    grid_engine.is_valid = MagicMock(side_effect=[False, True, False])
    worker_validator.validate()

    assert [HOST2] == host_storage.load_hosts()
