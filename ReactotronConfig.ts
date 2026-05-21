import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';

const reactotron = Reactotron.configure({
  name: 'pontofacial',
  host: 'localhost', // para emulador '10.0.2.2'
  port: 9090,
})
  .useReactNative({
    asyncStorage: false,
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: {veto: _stackFrame => false},
    overlay: false,
  })
  .use(reactotronRedux())
  .connect();

export default reactotron;
