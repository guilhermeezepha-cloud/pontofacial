import { useTheme } from '@react-navigation/native';

import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { Colors } from '../../styles/Themes';
import Icon from '../icon';
import SearchInputStyles from './SearchInputStyles';

interface SearchInputProps extends TextInputProps {
  defaultValue?: string;
  placeholder?: string;
  fieldsetStyle?: object;
  inputStyle?: object;
}

const SearchInput: React.FC<SearchInputProps> = ({
  fieldsetStyle,
  inputStyle,
  placeholder,
  ...props
}) => {
  const [text, setText] = useState('');
  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = SearchInputStyles(colors);

  return (
    <View style={[styles.container, fieldsetStyle]}>
      <View style={styles.icon}>
        <Icon name="search" width={20} height={20} />
      </View>

      <TextInput
        style={[styles.textInput, inputStyle]}
        placeholderTextColor={colors.secondaryLight}
        placeholder={placeholder}
        value={text}
        onChangeText={setText}
        {...props}
      />
    </View>
  );
};

export default SearchInput;
