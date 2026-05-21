import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M20.792 12.58l-1.106-1.914-4.969 8.662-3.053-3.51-.998 1.727 4.38 5.027 5.746-9.992z"
        fill={props.fill || '#fff'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.074 7.13A10.667 10.667 0 1121.926 24.87 10.667 10.667 0 0110.074 7.13zm.925 16.353A9 9 0 1021 8.517a9 9 0 00-10 14.966z"
        fill={props.fill || '#fff'}
      />
    </Svg>
  );
}

export default SvgComponent;
