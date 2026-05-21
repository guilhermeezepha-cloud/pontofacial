import {useTheme} from '@react-navigation/native';

import React from 'react';
import {View, ViewStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import Typography from '../typography';
import LogoSubtitleBlockStyles from './LogoSubtitleBlockStyles';

interface AdminPasswordSubtitleBLockProps {
  style?: ViewStyle;
}

const AdminPasswordSubtitleBLock: React.FC<AdminPasswordSubtitleBLockProps> = ({
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = LogoSubtitleBlockStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <Typography fontSize={14} color="black">
        Esta senha concede controle total sobre as definições do sistema,
        permitindo ajustes e personalizações conforme necessário.
      </Typography>

      <View style={styles.contentList}>
        <Typography fontSize={14} color="black" fontFamily="Poppins-Bold">
          Recomendação para a senha:
        </Typography>
        <View style={styles.listItem}>
          <Typography color="black" fontSize={12}>
            {'\u2022'}
          </Typography>
          <View style={styles.listItemText}>
            <Typography fontSize={12} color="black">
              No mínimo 8 caracteres
            </Typography>
          </View>
        </View>

        <View style={styles.listItem}>
          <Typography color="black" fontSize={12}>
            {'\u2022'}
          </Typography>
          <View style={styles.listItemText}>
            <Typography fontSize={12} color="black">
              Uma combinação de letras maiúsculas e minúsculas
            </Typography>
          </View>
        </View>

        <View style={styles.listItem}>
          <Typography color="black" fontSize={12}>
            {'\u2022'}
          </Typography>
          <View style={styles.listItemText}>
            <Typography fontSize={12} color="black">
              Pelo menos um número
            </Typography>
          </View>
        </View>

        <View style={styles.listItem}>
          <Typography color="black" fontSize={12}>
            {'\u2022'}
          </Typography>
          <View style={styles.listItemText}>
            <Typography fontSize={12} color="black">
              Um caractere especial (ex.: !, @, #, $, %, &, *)
            </Typography>
          </View>
        </View>
      </View>

      <Typography fontSize={14} color="black">
        Evite utilizar informações pessoais óbvias, como datas de aniversário ou
        nomes comuns, para aumentar a segurança.
      </Typography>
    </View>
  );
};

export default AdminPasswordSubtitleBLock;
