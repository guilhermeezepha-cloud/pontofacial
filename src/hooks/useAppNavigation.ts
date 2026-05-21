import {useNavigation} from '@react-navigation/native';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../config/navigation/Types';

export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const useAppNavigation = () => useNavigation<AppNavigationProp>();
