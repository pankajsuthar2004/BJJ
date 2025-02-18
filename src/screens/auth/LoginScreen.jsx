import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import LoginForm from './components/LoginForm';
import IMAGES from '../../assets/images';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={IMAGES.LoginBack} style={styles.background}>
        <ScrollView>
          <LoginForm />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

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
