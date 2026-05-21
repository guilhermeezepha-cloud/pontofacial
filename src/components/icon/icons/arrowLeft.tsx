import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={19} height={19} viewBox="0 0 19 19" fill="none" {...props}>
      <Path
        d="M6.637 9.667l4.866-4.875.437.438a.289.289 0 01.09.2.333.333 0 01-.075.23L7.94 9.666l3.956 3.948a.37.37 0 01.093.408.355.355 0 01-.086.125l-.392.393-4.222-4.223-.652-.651z"
        fill={props.fill || '#000'}
        fillOpacity={props.fillOpacity || 0.26}
      />
    </Svg>
  );
}

export default SvgComponent;
