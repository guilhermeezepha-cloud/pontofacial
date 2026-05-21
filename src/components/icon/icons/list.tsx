import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={65} height={65} viewBox="0 0 65 65" fill="none" {...props}>
      <Path
        d="M43.166 13.74h-24v5.334h24v-5.333zM43.166 24.407h-24v5.334h24v-5.334z"
        fill={props.fill || '#000'}
        fillOpacity={props.fillOpacity || 0.87}
      />
      <Path
        d="M48.414 5.74H13.919c-.73 0-1.43.282-1.946.782a2.625 2.625 0 00-.807 1.885v48c0 .708.29 1.386.807 1.886.516.5 1.216.781 1.946.781h34.495c.73 0 1.43-.28 1.946-.781.517-.5.806-1.178.806-1.886v-48c0-.707-.29-1.385-.806-1.885a2.798 2.798 0 00-1.946-.781zm-.743 3.334v46.667H14.607V9.074h33.064z"
        fill={props.fill || '#000'}
        fillOpacity={props.fillOpacity || 0.87}
      />
      <Path
        d="M43.166 35.074h-24v5.333h24v-5.333z"
        fill={props.fill || '#000'}
        fillOpacity={props.fillOpacity || 0.87}
      />
    </Svg>
  );
}

export default SvgComponent;
