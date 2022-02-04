/*
 * Copyright 2017-2022 EPAM Systems, Inc. (https://www.epam.com/)
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

/*
 MIT License

 Copyright (c) 2020 viv

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import React, {
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  AdditiveColormapExtension,
  LensExtension,
  PictureInPictureViewer,
} from '@hms-dbmi/viv';
import { HCSImageContext, useHCSImageState } from '../state';
import useElementSize from './utilities/use-element-size';

const additiveColorMapExtension = new AdditiveColormapExtension();
const lensExtension = new LensExtension();

function HCSImageViewer(
  {
    className,
    onStateChange,
    onRegisterStateActions,
    onViewerStateChanged,
    style,
  },
) {
  const {
    state,
    viewerState,
    callbacks,
  } = useHCSImageState();
  const containerRef = useRef();
  const size = useElementSize(containerRef);
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);
  useEffect(() => {
    if (onViewerStateChanged) {
      onViewerStateChanged(viewerState);
    }
  }, [viewerState, onViewerStateChanged]);
  useEffect(() => {
    if (onRegisterStateActions) {
      onRegisterStateActions(callbacks);
    }
  }, [callbacks, onRegisterStateActions]);
  const {
    setImageViewportLoaded,
  } = callbacks || {};
  const {
    channelsVisibility = [],
    contrastLimits = [],
    colors = [],
    selections = [],
    ready = false,
    colorMap,
    loader,
  } = viewerState;
  const readyForRendering = loader
        && ready
        && size
        && size.width
        && size.height;
  return (
    <HCSImageContext.Provider value={state}>
      <div
        className={className}
        style={({ position: 'relative', ...style || {} })}
        ref={containerRef}
      >
        {
                    readyForRendering && (
                    <PictureInPictureViewer
                      contrastLimits={contrastLimits}
                      colors={colors}
                      channelsVisible={channelsVisibility}
                      loader={loader}
                      selections={selections}
                      height={size.height}
                      width={size.width}
                      extensions={
                                colorMap ? [additiveColorMapExtension] : [lensExtension]
                            }
                      colormap={colorMap || 'viridis'}
                      onViewportLoad={setImageViewportLoaded}
                    />
                    )
                }
      </div>
    </HCSImageContext.Provider>
  );
}

HCSImageViewer.propTypes = {
  className: PropTypes.string,
  onStateChange: PropTypes.func,
  onRegisterStateActions: PropTypes.func,
  onViewerStateChanged: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

HCSImageViewer.defaultProps = {
  className: undefined,
  onStateChange: undefined,
  onRegisterStateActions: undefined,
  onViewerStateChanged: undefined,
  style: undefined,
};

export default HCSImageViewer;
