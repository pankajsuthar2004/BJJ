import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import SignupForm from './components/SignupForm';
import IMAGES from '../../assets/images';

const SignupScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={IMAGES.SignupBack} style={styles.background}>
        <ScrollView>
          <SignupForm />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});
