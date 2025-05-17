import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router, Link, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Giả lập token từ URL
  const params = useLocalSearchParams();
  const resetToken = params.token || '123456';

  const handleResetPassword = () => {
    // Kiểm tra dữ liệu nhập vào
    if (!password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    
    // Giả lập API đặt lại mật khẩu
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Chuyển hướng về trang đăng nhập sau 3 giây
      setTimeout(() => {
        router.replace('/login');
      }, 3000);
    }, 1500);
  };

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
          <Text style={styles.slogan}>Tạo mật khẩu mới cho tài khoản của bạn</Text>
        </View>

        <View style={styles.formContainer}>
          {!isSuccess ? (
            <>
              <Text style={styles.welcomeText}>Đặt lại mật khẩu</Text>
              <Text style={styles.instructionText}>
                Vui lòng nhập mật khẩu mới cho tài khoản của bạn. Mật khẩu phải có ít nhất 6 ký tự.
              </Text>
              
              <View style={styles.tokenContainer}>
                <Text style={styles.tokenLabel}>Mã xác nhận:</Text>
                <Text style={styles.tokenValue}>{resetToken}</Text>
              </View>
              
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#bfbfbf" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu mới"
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
              
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#bfbfbf" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Xác nhận mật khẩu mới"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesome name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#bfbfbf" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={[styles.resetButtonText, styles.loadingText]}>Đang xử lý...</Text>
                  </View>
                ) : (
                  <Text style={styles.resetButtonText}>Đặt lại mật khẩu</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <FontAwesome name="check" size={40} color="white" />
              </View>
              <Text style={styles.successTitle}>Đặt lại mật khẩu thành công!</Text>
              <Text style={styles.successText}>
                Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển đến trang đăng nhập sau vài giây.
              </Text>
            </View>
          )}

          <View style={styles.linkContainer}>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Quay lại đăng nhập</Text>
              </TouchableOpacity>
            </Link>
          </View>
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
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  tokenLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  tokenValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1890ff',
    letterSpacing: 1,
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
  resetButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  resetButtonDisabled: {
    backgroundColor: '#91caff',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
  successContainer: {
    alignItems: 'center',
    padding: 10,
  },
  successIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#52c41a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  successText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  link: {
    color: '#1890ff',
    fontSize: 14,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
}); 