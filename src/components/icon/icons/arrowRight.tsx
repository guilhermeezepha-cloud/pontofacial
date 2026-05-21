import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={18} height={19} viewBox="0 0 18 19" fill="none" {...props}>
      <Path
        d="M11.874 9.667L7 4.792l-.43.43a.289.289 0 00-.096.2c0 .084.029.165.082.23l4.037 4.015c-1.314 1.318-2.63 2.634-3.949 3.948a.37.37 0 00-.125.259.385.385 0 00.118.274l.393.393 4.222-4.223.622-.651z"
        fill={props.fill || '#000'}
        fillOpacity={props.fillOpacity || 0.87}
      />
    </Svg>
  );
}

export default SvgComponent;
