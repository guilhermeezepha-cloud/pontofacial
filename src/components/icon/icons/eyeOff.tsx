import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '..';

const EyeOffIcon = ({
  fill = '#000',
  width = 24,
  height = 24,
  fillOpacity = 1,
}: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 6.5C15.79 6.5 19.17 8.63 20.82 12C19.17 15.37 15.79 17.5 12 17.5C8.21 17.5 4.83 15.37 3.18 12C4.83 8.63 8.21 6.5 12 6.5ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 9.5C13.38 9.5 14.5 10.62 14.5 12C14.5 13.38 13.38 14.5 12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 10.62 10.62 9.5 12 9.5ZM12 7.5C9.52 7.5 7.5 9.52 7.5 12C7.5 14.48 9.52 16.5 12 16.5C14.48 16.5 16.5 14.48 16.5 12C16.5 9.52 14.48 7.5 12 7.5Z"
      fill={fill}
      fillOpacity={fillOpacity}
    />
    <Path
      d="M2.71 3.16C2.32 3.55 2.32 4.18 2.71 4.57L19.43 21.29C19.82 21.68 20.45 21.68 20.84 21.29C21.23 20.9 21.23 20.27 20.84 19.88L4.12 3.16C3.73 2.77 3.1 2.77 2.71 3.16Z"
      fill={fill}
      fillOpacity={fillOpacity}
    />
  </Svg>
);

export default EyeOffIcon;
