import {createNativeStackNavigator} from '@react-navigation/native-stack';

import React from 'react';

import {AppStackParamList} from './Types';

import {firstAccessDoneSelector} from '../../features/register/Slice';

import {useAppSelector} from '../../hooks/Redux';
import AdminAuthView from '../../views/auth/AdminAuthView';
import FaceRecognitionView from '../../views/camera-recognition';
import HomeView from '../../views/home';
import FirstAccessView from '../../views/register/FirstAccessView';
import SettingsMainView from '../../views/settings';
import AttendanceReportView from '../../views/settings/AttendanceReportView';
import IdentificationDataView from '../../views/settings/IdentificationDataView';
import PartnerLogoView from '../../views/settings/PartnerLogoView';
import EmployeeSyncView from '../../views/settings/EmployeeSyncView';
import SynchronizationView from '../../views/settings/SynchronizationView';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStackNavigator: React.FC = () => {
  const firstAccessDone = useAppSelector(state =>
    firstAccessDoneSelector(state),
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!firstAccessDone && (
        <Stack.Group>
          <Stack.Screen
            name="FirstAccess"
            component={FirstAccessView}
            options={{title: 'Primeiro Acesso'}}
          />
        </Stack.Group>
      )}

      {firstAccessDone && (
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="Home"
            component={HomeView}
            options={{title: 'Home'}}
          />
          <Stack.Screen
            name="FaceRecognition"
            component={FaceRecognitionView}
          />
        </Stack.Group>
      )}

      <Stack.Group screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="AdminAuth"
          component={AdminAuthView}
          options={{title: 'Acesso de Administrador'}}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="SettingsMain"
          component={SettingsMainView}
          options={{title: 'Configurações'}}
        />
        <Stack.Screen
          name="SettingsSynchronization"
          component={SynchronizationView}
          options={{title: 'Sincronizar Dados'}}
        />
        <Stack.Screen
          name="SettingsIdentificationData"
          component={IdentificationDataView}
          options={{title: 'Editar Dados de Identificação'}}
        />
        <Stack.Screen
          name="SettingsPartnerLogo"
          component={PartnerLogoView}
          options={{title: 'Editar Logo do Parceiro'}}
        />

        <Stack.Screen
          name="SettingsAttendanceReport"
          component={AttendanceReportView}
          options={{title: 'Editar Logo do Parceiro'}}
        />
        <Stack.Screen
          name="SettingsEmployeeSync"
          component={EmployeeSyncView}
          options={{title: 'Sincronizar Funcionários'}}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppStackNavigator;
