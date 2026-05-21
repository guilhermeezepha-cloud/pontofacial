import {useTheme} from '@react-navigation/native';

import React from 'react';
import {View} from 'react-native';

import {Colors} from '../../styles/Themes';
import Typography from '../typography';
import StepperStyles from './Styles';

interface StepperProps {
  totalSteps: number;
  currentStep: number;
  activeColor?: keyof Colors;
  inactiveColor?: keyof Colors;
}

const Stepper: React.FC<StepperProps> = ({
  totalSteps,
  currentStep,
  activeColor = 'primary',
  inactiveColor = 'gray',
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = StepperStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {Array.from({length: totalSteps}).map((_, index) => {
          const isActive = index < currentStep;
          return (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  backgroundColor: isActive
                    ? colors[activeColor]
                    : colors[inactiveColor],
                },
              ]}
            />
          );
        })}
      </View>
      <Typography fontSize={10} color="primary">
        Passo {currentStep}/{totalSteps}
      </Typography>
    </View>
  );
};

export default Stepper;
