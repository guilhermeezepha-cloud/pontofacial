import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={12} height={13} viewBox="0 0 12 13" fill="none" {...props}>
      <Path
        d="M10 6.667l-.705-.705L6.5 8.752V2.667h-1v6.085L2.71 5.957l-.71.71 4 4 4-4z"
        fill={props.fill || '#000'}
        fillOpacity={props.fillOpacity || 0.54}
      />
    </Svg>
  );
}

export default SvgComponent;
