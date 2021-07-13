/*
 * Copyright 2017-2021 EPAM Systems, Inc. (https://www.epam.com/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import Mutlizone from './mutlizone';
import parseRunServiceUrlConfiguration from './parse-run-service-url-configuration';

class MultizoneManager extends Mutlizone {
  constructor () {
    super();
    this.cache = new Map();
  }

  getRunMultiZoneConfiguration (runId) {
    return this.getMultiZoneConfiguration(`run-${runId}`);
  }

  getMultiZoneConfiguration (key) {
    if (!this.cache.has(key)) {
      this.cache.set(key, new Mutlizone(this.defaultRegion));
    }
    return this.cache.get(key);
  }
}

const defaultManager = new MultizoneManager();
export default defaultManager;
export {MultizoneManager, Mutlizone, parseRunServiceUrlConfiguration};
