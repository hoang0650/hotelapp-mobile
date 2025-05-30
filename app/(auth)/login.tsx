import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectAuthError, selectAuthStatus, selectIsAuthenticated, selectIsTwoFactorRequired, selectTwoFactorUserId } from '../../store/selectors/authSelectors';
import { clearAuthError, resetTwoFactor } from '../../store/slices/authSlice';
import { loginUser } from '../../store/thunks/authThunks';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isTwoFactorRequired = useAppSelector(selectIsTwoFactorRequired);
  const twoFactorUserId = useAppSelector(selectTwoFactorUserId);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [twoFactorCodeError, setTwoFactorCodeError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [twoFactorCodeFocused, setTwoFactorCodeFocused] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
      return;
    }

    if (authError && authStatus === 'failed') {
      setFormError(authError.message);
      dispatch(clearAuthError());
    }
    if (authStatus === 'succeeded' && !isTwoFactorRequired && !isAuthenticated) {
      router.replace('/(tabs)'); 
    }
  }, [authStatus, authError, dispatch, isTwoFactorRequired, isAuthenticated]);

  const clearAllErrors = () => {
    setEmailError(null);
    setPasswordError(null);
    setTwoFactorCodeError(null);
    setFormError(null);
  };

  const handleLogin = () => {
    clearAllErrors();
    let isValid = true;

    if (isTwoFactorRequired) {
      if (!twoFactorCode) {
        setTwoFactorCodeError('Vui lòng nhập mã xác thực.');
        isValid = false;
      }
      if (!twoFactorUserId) {
        setFormError('Lỗi xác thực hai yếu tố. Vui lòng thử lại.');
        dispatch(resetTwoFactor());
        isValid = false;
      }
      if (isValid) {
        dispatch(loginUser({ email, password, twoFactorCode }));
      }
    } else {
      if (!email) {
        setEmailError('Vui lòng nhập email.');
        isValid = false;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setEmailError('Email không hợp lệ.');
          isValid = false;
        }
      }
      if (!password) {
        setPasswordError('Vui lòng nhập mật khẩu.');
        isValid = false;
      }
      if (isValid) {
        dispatch(loginUser({ email, password }));
      } else if (!email && !password) {
        setFormError('Vui lòng nhập email và mật khẩu.');
      }
    }
  };

  const handleCancelTwoFactor = () => {
    dispatch(resetTwoFactor());
    setEmail('');
    setPassword('');
    setTwoFactorCode('');
    clearAllErrors();
  };

  const isLoading = authStatus === 'loading';

  return (
    <LinearGradient
      colors={['#E0EAFC', '#CFDEF3', '#E0EAFC']}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://placekitten.com/250/250' }}
              style={styles.logo}
            />
            <Text style={styles.appName}>Phần mềm Quản lý Khách sạn</Text>
            <Text style={styles.slogan}>Giải pháp quản lý toàn diện cho khách sạn của bạn</Text>
          </View>

          <View style={styles.formContainer}>
            {isTwoFactorRequired ? (
              <>
                <Text style={styles.welcomeText} testID="twoFactorAuthTitle">Xác thực hai yếu tố</Text>
                <Text style={styles.instructionText}>
                  Vui lòng nhập mã từ ứng dụng Authenticator của bạn.
                </Text>
                <View style={[styles.inputContainer, twoFactorCodeFocused && styles.inputContainerFocused]}>
                  <FontAwesome name="shield" size={22} color={twoFactorCodeFocused ? '#1890ff' : '#bfbfbf'} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mã xác thực (6 chữ số)"
                    value={twoFactorCode}
                    onChangeText={(text) => {
                      setTwoFactorCode(text);
                      if (twoFactorCodeError) setTwoFactorCodeError(null);
                      if (formError) setFormError(null);
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    onFocus={() => setTwoFactorCodeFocused(true)}
                    onBlur={() => setTwoFactorCodeFocused(false)}
                  />
                </View>
                {twoFactorCodeError && <Text style={styles.errorText}>{twoFactorCodeError}</Text>}
                {formError && !twoFactorCodeError && <Text style={styles.errorText}>{formError}</Text>}

                <TouchableOpacity 
                  onPress={handleLogin}
                  disabled={isLoading}
                  testID="confirmTwoFactorButton"
                >
                  <LinearGradient
                    colors={isLoading ? ['#91caff', '#ADC8FF'] : ['#1890ff', '#0050b3']}
                    style={[styles.loginButton, styles.marginTopLarge]}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.loginButtonText}>Xác nhận</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancelTwoFactor}
                  disabled={isLoading}
                  testID="cancelTwoFactorButton"
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.welcomeText} testID="loginTitle">Đăng nhập</Text>
                
                <View style={[styles.inputContainer, emailFocused && styles.inputContainerFocused]}>
                  <FontAwesome name="envelope" size={20} color={emailFocused ? '#1890ff' : '#bfbfbf'} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Địa chỉ Email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError(null);
                      if (formError) setFormError(null);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}
                
                <View style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused]}>
                  <FontAwesome name="lock" size={22} color={passwordFocused ? '#1890ff' : '#bfbfbf'} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError(null);
                      if (formError) setFormError(null);
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#bfbfbf" />
                  </TouchableOpacity>
                </View>
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                {formError && !emailError && !passwordError && <Text style={styles.errorText}>{formError}</Text>}

                <View style={styles.forgotPasswordContainer}>
                  <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                    <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  onPress={handleLogin}
                  disabled={isLoading}
                  testID="loginButton"
                >
                  <LinearGradient
                     colors={isLoading ? ['#91caff', '#ADC8FF'] : ['#1890ff', '#0050b3']}
                     style={[styles.loginButton, (!formError && !emailError && !passwordError) ? styles.marginTopLarge : styles.marginTopSmall]}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.loginButtonText}>Đăng nhập </Text>
                        <FontAwesome name="arrow-right" size={16} color="white" style={{marginLeft: 8}}/>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Chưa có tài khoản? </Text>
                  <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.registerLink}>Đăng ký ngay</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Phiên bản 1.0.0</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 60,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 30,
    marginBottom: 25,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 10,
    textAlign: 'center',
  },
  slogan: {
    fontSize: 16,
    color: '#37474F',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 30,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 15,
    color: '#455A64',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: '#FFFFFF',
  },
  inputContainerFocused: {
    borderColor: '#1565C0',
    borderWidth: 2,
    backgroundColor: '#E3F2FD',
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#263238',
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 15,
    paddingLeft: 8,
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 25,
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#1565C0',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginButton: {
    borderRadius: 12,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 3,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  marginTopSmall: {
    marginTop: 10,
  },
  marginTopLarge: {
    marginTop: 30,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    paddingBottom: 15,
  },
  registerText: {
    fontSize: 15,
    color: '#455A64',
  },
  registerLink: {
    fontSize: 15,
    color: '#1565C0',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 25,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 25 : 35,
  },
  footerText: {
    color: '#78909C',
    fontSize: 13,
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#78909C',
  },
  cancelButtonText: {
    color: '#263238',
    fontSize: 17,
    fontWeight: 'bold',
  },
}); 