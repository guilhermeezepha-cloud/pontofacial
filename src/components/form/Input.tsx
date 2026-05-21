import {useTheme} from '@react-navigation/native';

import React, {useState} from 'react';
import {TextInput, TextInputProps, TouchableOpacity, View} from 'react-native';

import {Colors} from '../../styles/Themes';
import Icon from '../icon';
import Typography from '../typography';
import InputStyles from './InputStyles';

interface InputProps extends TextInputProps {
  defaultValue?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  fieldsetStyle?: object;
  inputStyle?: object;
  showPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({
  fieldsetStyle,
  error,
  label,
  inputStyle,
  placeholder,
  showPasswordToggle = false,
  secureTextEntry,
  ...props
}) => {
  const [text, setText] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = InputStyles(colors, !!error, !!text);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const shouldSecureText = showPasswordToggle
    ? !isPasswordVisible
    : secureTextEntry;

  return (
    <View style={[styles.container, fieldsetStyle]}>
      {label && (
        <Typography
          color={!!error ? 'red' : 'textSecondary'}
          fontSize={10}
          style={styles.label}>
          {label}
        </Typography>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, inputStyle]}
          placeholderTextColor={colors.placeholder}
          placeholder={placeholder}
          value={text}
          onChangeText={setText}
          secureTextEntry={shouldSecureText}
          {...props}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconButton}
            activeOpacity={0.7}>
            <Icon
              name={isPasswordVisible ? 'eyeOff' : 'eye'}
              width={20}
              height={20}
              fill={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorText}>
          <Typography color="red" fontSize={9}>
            {error}
          </Typography>
        </View>
      )}
    </View>
  );
};

export default Input;
