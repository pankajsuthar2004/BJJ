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
import {useNavigation, CommonActions} from '@react-navigation/native';
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
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const isDarkMode = useColorScheme() === 'dark';
  const placeholderColor = isDarkMode ? Colors.gray : 'gray';
  const inputTextColor = isDarkMode ? Colors.black : Colors.black;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    else if (!Validation.name.test(name.trim()))
      newErrors.name = 'Invalid name format';

    if (!email.trim()) newErrors.email = 'Email address is required';
    else if (!Validation.email.test(email.trim()))
      newErrors.email = 'Invalid email format';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 8)
      newErrors.password = 'Password must be at least 8 characters long';
    else if (!Validation.password.test(password))
      newErrors.password =
        'Password must include uppercase, number, special character';

    if (!confirmPassword.trim())
      newErrors.confirmPassword = 'Confirm Password is required';
    else if (confirmPassword !== password)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignUpHandler = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await makeRequest({
        endPoint: EndPoints.Register,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          password_confirmation: confirmPassword.trim(),
        },
      });
      dispatch(setUser(response));
      showToast({message: 'Signup successful!', type: 'success'});
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'HomeStack'}],
        }),
      );
    } catch (error) {
      const responseData = error?.response?.data;
      console.log('Signup Error:', responseData);

      const emailError =
        responseData?.errors?.email?.[0] ||
        responseData?.message ||
        responseData?.error ||
        error?.message ||
        '';

      if (
        emailError.toLowerCase().includes('email') &&
        (emailError.toLowerCase().includes('taken') ||
          emailError.toLowerCase().includes('exist'))
      ) {
        showToast({message: 'Email already registered.', type: 'error'});
      } else {
        showToast({
          message: emailError || 'Signup failed. Please try again.',
          type: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.containerView}>
      <View style={styles.formlogoView}>
        <Image source={IMAGES.Logo} style={styles.logoView} />
        <View style={styles.formView}>
          <View style={styles.inputView}>
            {/* Name */}
            <TextInput
              style={[
                styles.input,
                {color: inputTextColor},
                errors.name && styles.errorBorder,
              ]}
              placeholder="Name"
              placeholderTextColor={placeholderColor}
              value={name}
              onChangeText={text => {
                setName(text);
                if (errors.name) setErrors(prev => ({...prev, name: ''}));
              }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            {/* Email */}
            <TextInput
              style={[
                styles.input,
                {color: inputTextColor},
                errors.email && styles.errorBorder,
              ]}
              placeholder="Email"
              placeholderTextColor={placeholderColor}
              keyboardType="email-address"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (errors.email) setErrors(prev => ({...prev, email: ''}));
              }}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Password */}
            <View
              style={[
                styles.inputContainer,
                errors.password && styles.errorBorder,
              ]}>
              <TextInput
                style={[styles.inputWithIcon, {color: inputTextColor}]}
                placeholder="Password"
                placeholderTextColor={placeholderColor}
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (errors.password)
                    setErrors(prev => ({...prev, password: ''}));
                }}
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
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Confirm Password */}
            <View
              style={[
                styles.inputContainer,
                errors.confirmPassword && styles.errorBorder,
              ]}>
              <TextInput
                style={[styles.inputWithIcon, {color: inputTextColor}]}
                placeholder="Confirm Password"
                placeholderTextColor={placeholderColor}
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors(prev => ({...prev, confirmPassword: ''}));
                }}
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
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={onSignUpHandler}>
            <Text style={styles.signUpButtonText}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{marginTop: 30}}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.signupText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(13),
  },
  formlogoView: {
    width: wp((328 / 430) * 100),
    height: hp((711 / 919) * 100),
    flexDirection: 'column',
    alignItems: 'center',
    gap: hp(6),
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
    marginTop: hp((75 / 919) * 100),
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
  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
    marginLeft: 6,
    alignSelf: 'flex-start',
  },
  errorBorder: {
    borderColor: Colors.red,
    borderWidth: 1,
  },
  icon: {
    paddingHorizontal: 10,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default SignUpForm;
