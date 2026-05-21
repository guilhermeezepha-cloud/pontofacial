import Svg, {G, Mask, Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={props.width || 16}
      height={props.height || 17}
      viewBox="0 0 16 17"
      fill="none"
      {...props}>
      <Mask
        id="a"
        style={{
          maskType: 'alpha',
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={props.width || 16}
        height={props.height || 17}>
        <Path fill="#D9D9D9" d="M0 0.666626H16V16.666626H0z" />
      </Mask>
      <G mask="url(#a)" fill={props.fill || '#262625'}>
        <Path d="M5.333 5.667l.917.966-1.7 1.7H10v1.334H4.55l1.7 1.7-.917.966L2 9l3.333-3.333z" />
        <Path d="M8 15v-1.333h4.667V4.333H8V3h4.667c.366 0 .68.13.941.392.261.26.392.575.392.941v9.334c0 .366-.13.68-.392.941a1.284 1.284 0 01-.941.392H8z" />
      </G>
    </Svg>
  );
}

export default SvgComponent;
