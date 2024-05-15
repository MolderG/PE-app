import { TextInput, TextInputProps } from 'react-native';
import React, { useState } from 'react';
import Font from '../constants/Font';
import Spacing from '../constants/Spacing';
import Colors from '../constants/Colors';
import FontSize from '../constants/FontSize';

export function AppTextInput(otherProps: TextInputProps) {
  const [focused, setFocused] = useState<boolean>(false);
  return (
    <TextInput
      autoCapitalize="none"
      autoCorrect={false}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholderTextColor={Colors.darkText}
      style={[
        {
          fontFamily: Font['poppins-regular'],
          fontSize: FontSize.small,
          padding: Spacing * 2,
          backgroundColor: Colors.lightPrimary,
          borderRadius: Spacing,
          marginVertical: Spacing,
        },
        focused && {
          borderWidth: 3,
          borderColor: Colors.primary,
          shadowOffset: { width: 4, height: Spacing },
          shadowColor: Colors.primary,
          shadowOpacity: 0.2,
          shadowRadius: Spacing,
        },
      ]}
      {...otherProps}
    />
  );
}
