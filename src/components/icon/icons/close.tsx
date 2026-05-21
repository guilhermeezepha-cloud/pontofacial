import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M24.438 9.21l-1.663-1.663L16 14.322 9.225 7.547 7.562 9.21l6.775 6.775-6.775 6.776 1.663 1.663L16 17.648l6.775 6.776 1.663-1.663-6.775-6.776 6.775-6.775z"
        fill={props.fill || '#5FA82A'}
      />
    </Svg>
  );
}

export default SvgComponent;
