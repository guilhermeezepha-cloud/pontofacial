import Svg, {Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={128} height={129} viewBox="0 0 128 129" fill="none" {...props}>
      <Path
        d="M64.002 21.833a42.667 42.667 0 110 85.334 42.667 42.667 0 010-85.334zM77.78 31.24a36 36 0 10-27.554 66.52 36 36 0 0027.554-66.52zm-8.441 54.593H58.67V75.167h10.667v10.666zm0-45.333c-.48 8.907-1.373 20.426-1.907 29.333h-6.678c-.534-8.907-1.602-20.426-2.082-29.333h10.667z"
        fill={props.fill || '#E4002B'}
      />
    </Svg>
  );
}

export default SvgComponent;
