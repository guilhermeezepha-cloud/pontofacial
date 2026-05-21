import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M16 5.333a10.667 10.667 0 110 21.334 10.667 10.667 0 010-21.334zm3.444 2.352a9 9 0 10-6.887 16.63 9 9 0 006.887-16.63zm-2.11 13.648h-2.668v-2.667h2.667v2.667zm0-11.333c-.12 2.227-.344 5.107-.477 7.333h-1.67c-.134-2.226-.4-5.106-.52-7.333h2.666z"
        fill={props.fill || '#fff'}
      />
    </Svg>
  );
}

export default SvgComponent;
