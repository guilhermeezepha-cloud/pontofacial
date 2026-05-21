import {ImageSourcePropType} from 'react-native';

interface ActionNotifiable {
  type: string;
  payload: ReduxNotifyPayload;
}

interface ReduxNotifyPayload {
  messages?: Array<string>;
  message?: string;
  ex?: Error | AxiosError;
}

interface CarouselImageItemProps {
  item: ImageSourcePropType | string;
  index: number;
}
