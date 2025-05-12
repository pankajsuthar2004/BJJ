import React, {useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import IMAGES from '../../assets/images';
import {useAppSelector} from '../../store/Hooks';

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
      const clearTimeoutFn = handleNavigation();
      return clearTimeoutFn;
    });
  }, [fadeAnim, navigation, user]);

  const user = useAppSelector(state => (state ? state?.user?.user : null));

  // Function to handle navigation and clearing timeout
  const handleNavigation = () => {
    const navigate = setTimeout(() => {
      if (user) {
        navigation.dispatch(
          CommonActions.reset({index: 0, routes: [{name: 'HomeStack'}]}),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({routes: [{name: 'AuthStack'}]}),
        );
      }
    }, 2000);

    // Clear the timeout when it's no longer needed
    return () => clearTimeout(navigate);
  };

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
