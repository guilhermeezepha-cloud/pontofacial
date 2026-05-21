import {useTheme} from '@react-navigation/native';

import React from 'react';
import {View, ViewStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import Typography from '../typography';
import LogoSubtitleBlockStyles from './LogoSubtitleBlockStyles';

interface LogoSubtitleBlockProps {
  style?: ViewStyle;
}

const LogoSubtitleBlock: React.FC<LogoSubtitleBlockProps> = ({style}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = LogoSubtitleBlockStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <Typography fontSize={14} color="black">
        Para garantir a melhor qualidade e visualização do logotipo, por favor,
        siga os requisitos abaixo ao fazer o upload da imagem:
      </Typography>

      <View style={styles.contentList}>
        <View style={styles.listItem}>
          <Typography color="black" fontSize={12}>
            {'\u2022'}
          </Typography>
          <View style={styles.listItemText}>
            <Typography fontSize={12} color="black">
              <Typography fontSize={12} color="black" fontFamily="Poppins-Bold">
                Formato
              </Typography>
              : PNG
            </Typography>
          </View>
        </View>

        <View style={styles.listItem}>
          <Typography color="black" fontSize={12}>
            {'\u2022'}
          </Typography>
          <View style={styles.listItemText}>
            <Typography fontSize={12} color="black">
              <Typography fontSize={12} color="black" fontFamily="Poppins-Bold">
                Dimensões
              </Typography>
              : 300x300 pixels (quadrado)
            </Typography>
          </View>
        </View>

        <View style={styles.listItem}>
          <Typography color="black" fontSize={12}>
            {'\u2022'}
          </Typography>
          <View style={styles.listItemText}>
            <Typography fontSize={12} color="black">
              <Typography fontSize={12} color="black" fontFamily="Poppins-Bold">
                Tamanho do arquivo
              </Typography>
              : Máximo de 2MB
            </Typography>
          </View>
        </View>

        <View style={styles.listItem}>
          <Typography color="black" fontSize={12}>
            {'\u2022'}
          </Typography>
          <View style={styles.listItemText}>
            <Typography fontSize={12} color="black">
              <Typography fontSize={12} color="black" fontFamily="Poppins-Bold">
                Cor
              </Typography>
              : Fundo transparente.
            </Typography>
          </View>
        </View>
      </View>

      <Typography fontSize={14} color="black">
        <Typography fontSize={14} color="black" fontFamily="Poppins-Bold">
          Instruções para upload
        </Typography>
        : Arraste sua foto ou clique na área abaixo para carregar uma imagem.
        Certifique-se de que o logotipo esteja claro e legível.
      </Typography>
    </View>
  );
};

export default LogoSubtitleBlock;
