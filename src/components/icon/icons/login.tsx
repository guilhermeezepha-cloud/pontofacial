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
      <G mask="url(#a)">
        <Path
          d="M8 14.667v-1.334h4.667V4H8V2.667h4.667c.366 0 .68.13.941.391.261.261.392.575.392.942v9.333c0 .367-.13.68-.392.942a1.284 1.284 0 01-.941.392H8zM6.667 12l-.917-.967 1.7-1.7H2V8h5.45l-1.7-1.7.917-.967L10 8.667 6.667 12z"
          fill={props.fill || '#262625'}
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
