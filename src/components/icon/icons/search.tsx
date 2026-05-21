import Svg, {G, Mask, Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={props.width || 17}
      height={props.height || 16}
      viewBox="0 0 16 16"
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
        width={props.width || 17}
        height={props.height || 16}>
        <Path fill={props.fill || '#959595'} d="M0 0H16V16H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M13.067 14l-4.2-4.2a4.062 4.062 0 01-2.533.867c-1.212 0-2.237-.42-3.076-1.259S2 7.544 2 6.333c0-1.21.42-2.236 1.258-3.075C4.098 2.42 5.122 2 6.333 2s2.236.42 3.075 1.258c.84.84 1.259 1.864 1.259 3.075A4.062 4.062 0 019.8 8.867l4.2 4.2-.933.933zM6.333 9.333c.834 0 1.542-.291 2.125-.875a2.893 2.893 0 00.875-2.125c0-.833-.291-1.541-.875-2.125a2.893 2.893 0 00-2.125-.875c-.833 0-1.541.292-2.125.875a2.893 2.893 0 00-.875 2.125c0 .834.292 1.542.875 2.125a2.893 2.893 0 002.125.875z"
          fill={props.fill || '#959595'}
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
