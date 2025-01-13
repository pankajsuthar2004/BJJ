import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import {Fonts} from '../assets/fonts';
import Colors from '../theme/color';

const AppTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  containerStyle = {},
  style = {},
  multiline = false,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        textAlignVertical={multiline ? 'top' : 'center'}
        multiline={multiline}
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="gray"
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    // position: 'relative',
  },
  label: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.bold,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    padding: 24,
    fontSize: 16,
    fontFamily: Fonts.regular,
    backgroundColor: Colors.white,
    color: Colors.black,
  },
});

export default AppTextInput;
