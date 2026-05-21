import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={70} height={87} viewBox="0 0 70 87" fill="none" {...props}>
      <Path
        d="M64.363.124L27.8 69.712 5.075 41.188.28 50.256l29.136 36.52L69.72 10.248 64.363.124z"
        fill={props.fill || '#5FA82A'}
      />
    </Svg>
  );
}

export default SvgComponent;
