import Svg, {G, Path} from 'react-native-svg';

import {SvgProps} from '../';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={22} height={23} viewBox="0 0 22 23" fill="none" {...props}>
      <G filter="url(#filter0_d_36_3185)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.888 2.962c3.278-.006 6.75.988 6.863 1.655 0 .222-.166.39-.166.39l-5.214 5.176.008 4.167c0 .187-.435.375-.64.463l-.087.038c-.11.056-.166.056-.222.056a.505.505 0 01-.39-.165l-1.39-1.387c-.112-.11-.223-.222-.224-.389l-.02-2.778-4.995-4.991s-.445-.388-.001-.833c.61-.668 3.589-1.397 6.478-1.402zm0 .889c-3.031.005-4.647.57-5.227.804a.222.222 0 00-.076.361l2.921 2.987c.042.043.1.067.16.067h4.444a.222.222 0 00.152-.06l3.141-2.95a.222.222 0 00-.067-.368c-.693-.288-2.196-.847-5.449-.841z"
          fill={props.fill || '#000'}
          fillOpacity={props.fillOpacity || 0.54}
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
