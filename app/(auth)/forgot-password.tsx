import { FontAwesome } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppSelector } from '../../store';
import { selectIsAuthenticated } from '../../store/selectors/authSelectors';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/profile');
    }
  }, [isAuthenticated]);

  const handleSendResetLink = () => {
    // Kiểm tra dữ liệu nhập vào
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    setIsLoading(true);
    
    // Giả lập API gửi email đặt lại mật khẩu
    setTimeout(() => {
      setIsLoading(false);
      setIsRequestSent(true);
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
          <Text style={styles.slogan}>Khôi phục mật khẩu của bạn</Text>
        </View>

        <View style={styles.formContainer}>
          {!isRequestSent ? (
            <>
              <Text style={styles.welcomeText}>Quên mật khẩu?</Text>
              <Text style={styles.instructionText}>
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
              </Text>
              
              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={20} color="#bfbfbf" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.resetButton,
                  isLoading && styles.resetButtonDisabled,
                  pressed && styles.pressedItem
                ]}
                onPress={handleSendResetLink}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={[styles.resetButtonText, styles.loadingText]}>Đang gửi...</Text>
                  </View>
                ) : (
                  <Text style={styles.resetButtonText}>Gửi liên kết đặt lại</Text>
                )}
              </Pressable>
            </>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <FontAwesome name="check" size={40} color="white" />
              </View>
              <Text style={styles.successTitle}>Yêu cầu đã được gửi!</Text>
              <Text style={styles.successText}>
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác).
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.resetPasswordButton,
                  pressed && styles.pressedItem
                ]}
                onPress={() => router.push('/reset-password')}
              >
                <Text style={styles.resetButtonText}>Đặt lại mật khẩu</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.linkContainer}>
            <Link href="/login" asChild>
              <Pressable style={({pressed}) => pressed && styles.pressedItem}>
                <Text style={styles.link}>Quay lại đăng nhập</Text>
              </Pressable>
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
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 8,
    marginBottom: 20,
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
    marginBottom: 20,
    lineHeight: 20,
  },
  resetPasswordButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
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
  pressedItem: {
    opacity: 0.7,
  }
}); 