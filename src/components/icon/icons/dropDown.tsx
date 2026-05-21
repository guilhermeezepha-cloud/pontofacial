import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={19} height={19} viewBox="0 0 19 19" fill="none" {...props}>
      <Path
        d="M5.852 8.185l3.703 3.704 3.704-3.704H5.852z"
        fill={props.fill || '#000'}
        fillOpacity={props.fillOpacity || 0.54}
      />
    </Svg>
  );
}

export default SvgComponent;
