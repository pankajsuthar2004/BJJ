import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Colors from '../theme/color';
import {Fonts} from '../assets/fonts';

const CustomButton = ({title, onPress, style, textStyle}) => {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <Text style={{...styles.text, ...textStyle}}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.red,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: Fonts.bold,
  },
});

export default CustomButton;
