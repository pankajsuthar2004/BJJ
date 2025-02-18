import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Colors from '../theme/color';
import {Fonts} from '../assets/fonts';

const CustomTextInput = ({
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="gray"
        secureTextEntry={secureTextEntry}
      />
      {Icon && <Icon style={styles.icon} />}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  icon: {
    position: 'absolute',
    left: 25,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.darkGray,
    paddingLeft: 60,
    paddingVertical: 15,
    borderRadius: 8,
    color: Colors.white,
    fontFamily: Fonts.normal,
  },
});

export default CustomTextInput;
