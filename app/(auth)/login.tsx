import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectAuthError, selectAuthStatus, selectIsAuthenticated, selectIsTwoFactorRequired, selectTwoFactorUserId } from '../../store/selectors/authSelectors';
import { clearAuthError, resetTwoFactor } from '../../store/slices/authSlice';
import { loginUser } from '../../store/thunks/authThunks';

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
  
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
      return;
    }

    if (authError && authStatus === 'failed') {
      Alert.alert('Đăng nhập thất bại', authError.message);
      dispatch(clearAuthError());
    }
    if (authStatus === 'succeeded' && !isTwoFactorRequired && !isAuthenticated) {
      router.replace('/(tabs)'); 
    }
  }, [authStatus, authError, dispatch, isTwoFactorRequired, isAuthenticated]);

  const handleLogin = () => {
    if (isTwoFactorRequired) {
      if (!twoFactorCode) {
        Alert.alert('Lỗi', 'Vui lòng nhập mã xác thực 2 yếu tố.');
        return;
      }
      if (!twoFactorUserId) {
        Alert.alert('Lỗi', 'Thiếu thông tin người dùng cho xác thực 2 yếu tố.');
        dispatch(resetTwoFactor());
        return;
      }
      dispatch(loginUser({ email, password, twoFactorCode }));
    } else {
      if (!email || !password) {
        Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu.');
        return;
      }
      dispatch(loginUser({ email, password }));
    }
  };

  const handleCancelTwoFactor = () => {
    dispatch(resetTwoFactor());
    setEmail('');
    setPassword('');
    setTwoFactorCode('');
  };

  const isLoading = authStatus === 'loading';

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://placekitten.com/200/200' }}
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
                Vui lòng nhập mã xác thực từ ứng dụng Authenticator của bạn.
              </Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="shield" size={20} color="#bfbfbf" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mã xác thực (6 chữ số)"
                  value={twoFactorCode}
                  onChangeText={setTwoFactorCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                testID="confirmTwoFactorButton"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Xác nhận</Text>
                )}
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
              
              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={20} color="#bfbfbf" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#bfbfbf" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#bfbfbf" />
                </TouchableOpacity>
              </View>

              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                testID="loginButton"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                )}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 15,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  slogan: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#1890ff',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#91caff',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#1890ff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9'
  },
  cancelButtonText: {
    color: '#595959',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 