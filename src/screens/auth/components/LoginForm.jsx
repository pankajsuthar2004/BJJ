import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
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

const LoginForm = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

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
      showToast({message: 'Login successful!'});
    } catch (error) {
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
            <Image
              source={IMAGES.User}
              style={{marginLeft: 24, height: 24, width: 24}}
            />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Username"
              placeholderTextColor="gray"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Image
              source={IMAGES.Lock}
              style={{marginLeft: 24, height: 24, width: 24}}
            />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Password"
              placeholderTextColor="gray"
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
            <Image
              source={IMAGES.LinePic}
              style={{alignSelf: 'center', height: 20, width: 250}}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.socialButton}>
              <Image source={IMAGES.Google} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image source={IMAGES.Apple} />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>
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
    opacity: '50%',
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
    // justifyContent: 'space-between',
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
  input: {
    height: hp((56 / 932) * 100),
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    width: '100%',
    fontFamily: Fonts.normal,
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
    // fontFamily: Fonts.bold,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: Colors.white,
    fontFamily: Fonts.normal,
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
});

export default LoginForm;
