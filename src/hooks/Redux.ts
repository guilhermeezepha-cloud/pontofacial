import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

import type { AppDispatch, RootState } from './../config/Redux';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
