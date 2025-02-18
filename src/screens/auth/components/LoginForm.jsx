import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import IMAGES from '../../../assets/images';
import Colors from '../../../theme/color';
import {hp, wp} from '../../../utility/ResponseUI';
import {Fonts} from '../../../assets/fonts';
import {useAppDispatch} from '../../../store/Hooks';
import {Validation} from '../../../utility/Validation';
import {showToast} from '../../../utility/Toast';
import makeRequest from '../../../api/http';
import {EndPoints} from '../../../api/config';
import AppLoader from '../../../components/AppLoader';
import {setUser} from '../../../Slices/UserSlice';
import SVG from '../../../assets/svg';

const LoginForm = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const isDarkMode = useColorScheme() === 'dark';
  const placeholderColor = isDarkMode ? Colors.litegray : 'gray';
  const inputTextColor = isDarkMode ? Colors.white : Colors.black;

  const onLoginHandler = async () => {
    const enteredEmail = email.trim();
    const enteredPass = password.trim();

    if (!Validation.email.test(enteredEmail)) {
      showToast({message: 'Invalid Email'});
      return;
    }

    if (!Validation.password.test(enteredPass)) {
      showToast({message: 'Invalid password'});
      return;
    }

    try {
      setLoading(true);
      const user = await makeRequest({
        endPoint: EndPoints.Login,
        method: 'POST',
        body: {
          email: enteredEmail,
          password: enteredPass,
        },
      });
      dispatch(setUser(user));

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'HomeStack'}],
        }),
      );
      showToast({message: 'Login successful!', type: 'success'});
    } catch (error) {
      showToast({message: 'Login failed. Please try again.', type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.containerView}>
      <View style={styles.formlogoView}>
        <Image source={IMAGES.Logo} style={styles.logoView} />
        <View style={styles.mainView}>
          <View style={styles.inputContainer}>
            <SVG.User style={{marginLeft: 24}} />
            <TextInput
              style={[styles.inputWithIcon, {color: inputTextColor}]}
              placeholder="Email"
              placeholderTextColor={placeholderColor}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <SVG.Lock style={{marginLeft: 24}} />
            <TextInput
              style={[styles.inputWithIcon, {color: inputTextColor}]}
              placeholder="Password"
              placeholderTextColor={placeholderColor}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={() => setPasswordVisible(!passwordVisible)}>
              <Image
                source={passwordVisible ? IMAGES.OpenEye : IMAGES.CloseEye}
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgetPasswordText}>Forget Password</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={onLoginHandler}>
          <Text style={styles.signUpButtonText}>Login Now</Text>
        </TouchableOpacity>
        <View
          style={{
            height: hp((172 / 932) * 100),
            justifyContent: 'space-between',
            width: '100%',
            marginTop: hp((30 / 932) * 100),
          }}>
          <View>
            <SVG.LinePic style={{alignSelf: 'center'}} />
          </View>
          <View>
            <TouchableOpacity style={styles.socialButton}>
              <SVG.Google />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <SVG.Apple />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 5, marginVertical: 8}}>
          <TouchableOpacity style={styles.soicalLogo}>
            <SVG.FacebookLogo width={wp(15)} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.soicalLogo}>
            <SVG.LinkedinLogo width={wp(15)} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.soicalLogo}>
            <SVG.InstagramLogo width={wp(15)} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.soicalLogo}>
            <SVG.XappLogo width={wp(15)} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{height: hp((98 / 932) * 100)}}>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={styles.loginText}>
            Don't have account? <Text style={styles.signupLink}>SignUp</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <AppLoader loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    height: hp((156 / 932) * 100),
    width: '100%',
    justifyContent: 'space-between',
    marginTop: hp((50 / 932) * 100),
  },
  formlogoView: {
    width: wp((327 / 430) * 100),
    height: hp((749 / 932) * 100),
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: hp((70 / 932) * 100),
  },
  logoView: {
    width: wp((195 / 430) * 100),
    height: hp((171 / 932) * 100),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingRight: 15,
    justifyContent: 'space-between',
  },
  forgetPasswordText: {
    color: Colors.white,
    textAlign: 'right',
    fontFamily: Fonts.normal,
  },
  signUpButton: {
    backgroundColor: Colors.red,
    height: hp((56 / 932) * 100),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: '100%',
    marginTop: hp((32 / 932) * 100),
  },
  signUpButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButton: {
    backgroundColor: Colors.white,
    height: hp((56 / 932) * 100),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginVertical: hp((7 / 932) * 100),
  },
  socialButtonText: {
    fontFamily: Fonts.normal,
    fontSize: 16,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  signupLink: {
    fontSize: 16,
    color: Colors.red,
    fontFamily: Fonts.bold,
    textDecorationLine: 'underline',
  },
  inputWithIcon: {
    flex: 1,
    height: hp((56 / 919) * 100),
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  soicalLogo: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    width: wp(18),
    height: hp(6),
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default LoginForm;
