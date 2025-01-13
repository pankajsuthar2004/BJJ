import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import IMAGES from '../../../assets/images';
import Colors from '../../../theme/color';
import {hp, wp} from '../../../utility/ResponseUI';
import {Fonts} from '../../../assets/fonts';
import {showToast} from '../../../utility/Toast';
import {Validation} from '../../../utility/Validation';
import makeRequest from '../../../api/http';
import {EndPoints} from '../../../api/config';
import {useAppDispatch} from '../../../store/Hooks';
import {setUser} from '../../../Slices/UserSlice';

const SignUpForm = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();

  const onSignUpHandler = async () => {
    const enteredName = name.trim();
    const enteredEmail = email.trim();
    const enteredPass = password.trim();
    const enteredConfirmPass = confirmPassword.trim();

    if (enteredName.length === 0) {
      showToast({message: 'Enter Name'});
      return;
    }

    if (!Validation.email.test(enteredEmail)) {
      showToast({message: 'Invalid Email Address'});
      return;
    }

    if (!Validation.password.test(enteredPass)) {
      showToast({
        message: 'Invalid Password',
      });
      return;
    }

    if (enteredPass !== enteredConfirmPass) {
      showToast({message: 'Passwords do not match'});
      return;
    }

    try {
      setLoading(true);
      const response = await makeRequest({
        endPoint: EndPoints.Register,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: {
          name: enteredName,
          email: enteredEmail,
          password: enteredPass,
          password_confirmation: enteredConfirmPass,
        },
      });
      console.log(response);
      dispatch(setUser(response));

      showToast({message: 'Signup successful!'});
      navigation.navigate('LoginScreen');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.containerView}>
      <View style={[styles.formlogoView]}>
        <Image source={IMAGES.Logo} style={styles.logoView} />
        <View style={styles.formView}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="gray"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <View style={styles.inputContainer}>
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
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Confirm Password"
                placeholderTextColor="gray"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!confirmPasswordVisible}
              />
              <TouchableOpacity
                style={styles.icon}
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }>
                <Image
                  source={
                    confirmPasswordVisible ? IMAGES.OpenEye : IMAGES.CloseEye
                  }
                  style={styles.iconImage}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={onSignUpHandler}>
            <Text style={styles.signUpButtonText}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.signupText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: wp(29),
  },
  formlogoView: {
    width: wp((328 / 430) * 100),
    height: hp((711 / 919) * 100),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoView: {
    width: wp((195 / 430) * 100),
    height: hp((171 / 919) * 100),
  },
  formView: {
    width: '100%',
    height: hp((352 / 919) * 100),
  },
  inputView: {
    height: hp((272 / 919) * 100),
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingRight: 15,
    justifyContent: 'space-between',
  },
  inputWithIcon: {
    flex: 1,
    height: hp((56 / 919) * 100),
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  input: {
    height: hp((56 / 919) * 100),
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  signUpButton: {
    backgroundColor: Colors.red,
    height: hp((56 / 919) * 100),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: hp((20 / 919) * 100),
  },
  signUpButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Fonts.normal,
  },
  loginLink: {
    fontSize: 16,
    color: Colors.red,
    fontFamily: Fonts.bold,
    textDecorationLine: 'underline',
  },
  signupText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: Fonts.normal,
  },
});

export default SignUpForm;
