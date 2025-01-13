import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import SignupForm from './components/SignupForm';
import IMAGES from '../../assets/images';

const SignupScreen = ({navigation}) => {
  return (
    <View>
      <ImageBackground
        source={IMAGES.SignupBack}
        style={{height: '100%', width: '100%'}}>
        <ScrollView>
          <SignupForm />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({});
