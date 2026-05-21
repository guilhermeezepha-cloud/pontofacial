import {combineReducers} from 'redux';

import {AttendanceSlice} from '../features/attendance/Slice';
import {AuthSlice} from '../features/auth/Slice';
import {FaceRecognitionSlice} from '../features/face-recognition/Slice';
import {MenuSlice} from '../features/menu/Slice';
import {RegisterSlice} from '../features/register/Slice';
import {SettingsSlice} from '../features/settings/Slice';

import {EmployeesSlice} from '../features/employees';

const createRootReducer = () =>
  combineReducers({
    faceRecognition: FaceRecognitionSlice.reducer,
    menu: MenuSlice.reducer,
    settings: SettingsSlice.reducer,
    register: RegisterSlice.reducer,
    auth: AuthSlice.reducer,
    attendance: AttendanceSlice.reducer,
    employees: EmployeesSlice.reducer,
  });

export default createRootReducer;
