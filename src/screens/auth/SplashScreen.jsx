import React, {useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import IMAGES from '../../assets/images';

const {width, height} = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'AuthStack'}],
      });
    });
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground source={IMAGES.FirstPic} style={styles.image}>
        <View style={styles.centerContainer}>
          <Animated.View style={{opacity: fadeAnim}}>
            <Image source={IMAGES.Logo} style={styles.logo} />
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: height,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: (width * 225) / 430,
    height: (height * 197) / 923,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
