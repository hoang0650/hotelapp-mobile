import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginScreen from '../app/(auth)/login';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockStore = configureStore([]);

const mockInitialAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
  isTwoFactorRequired: false,
  twoFactorUserId: null,
};

describe('LoginScreen', () => {
  let store: any;

  const renderComponent = (customStoreState?: any) => {
    store = mockStore({
      auth: {
        ...mockInitialAuthState,
        ...(customStoreState?.auth || {}),
      },
    });
    store.dispatch = jest.fn(); // Mock dispatch

    return render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TC-LOGIN-01: Hiển thị các trường nhập liệu và nút bấm', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Mật khẩu')).toBeTruthy();
    expect(screen.getByTestId('loginButton')).toBeTruthy();
    expect(screen.getByText('Quên mật khẩu?')).toBeTruthy();
    expect(screen.getByText('Đăng ký ngay')).toBeTruthy();
    expect(screen.getByTestId('loginTitle')).toBeTruthy();
  });

  test('TC-LOGIN-02: Cho phép nhập email và mật khẩu', () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Mật khẩu');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  test('TC-LOGIN-03: Hiển thị thông báo lỗi khi để trống email hoặc mật khẩu', () => {
    renderComponent();
    const loginButton = screen.getByTestId('loginButton');

    fireEvent.press(loginButton);
    expect(Alert.alert).toHaveBeenCalledWith('Lỗi', 'Vui lòng nhập email và mật khẩu.');

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(loginButton);
    expect(Alert.alert).toHaveBeenCalledWith('Lỗi', 'Vui lòng nhập email và mật khẩu.'); // Vẫn lỗi vì thiếu pass

    fireEvent.changeText(screen.getByPlaceholderText('Email'), '');
    fireEvent.changeText(screen.getByPlaceholderText('Mật khẩu'), 'password123');
    fireEvent.press(loginButton);
    expect(Alert.alert).toHaveBeenCalledWith('Lỗi', 'Vui lòng nhập email và mật khẩu.'); // Vẫn lỗi vì thiếu email
  });

  test('TC-LOGIN-04: Gọi action loginUser khi nhấn nút Đăng nhập với thông tin hợp lệ', () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Mật khẩu');
    const loginButton = screen.getByTestId('loginButton');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  test('TC-LOGIN-05: Điều hướng đến màn hình (tabs) khi đăng nhập thành công', async () => {
    const { router } = require('expo-router');
    renderComponent({
      auth: {
        ...mockInitialAuthState,
        status: 'succeeded',
        isAuthenticated: true,
        isTwoFactorRequired: false, // Quan trọng: không yêu cầu 2FA
      },
    });

    // Chờ cho useEffect trong LoginScreen được thực thi
    await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  test('TC-LOGIN-06: Hiển thị thông báo lỗi từ server khi đăng nhập thất bại', async () => {
    const errorMessage = 'Email hoặc mật khẩu không đúng.';
    renderComponent({
      auth: {
        ...mockInitialAuthState,
        status: 'failed',
        error: { message: errorMessage },
      },
    });
    
    // Chờ cho useEffect trong LoginScreen được thực thi và hiển thị Alert
    await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Đăng nhập thất bại', errorMessage);
    });
  });

  test('TC-LOGIN-07: Hiển thị form nhập mã 2FA khi isTwoFactorRequired là true', () => {
    renderComponent({
      auth: {
        ...mockInitialAuthState,
        isTwoFactorRequired: true,
        twoFactorUserId: 'user123',
      },
    });

    expect(screen.getByTestId('twoFactorAuthTitle')).toBeTruthy();
    expect(screen.getByPlaceholderText('Mã xác thực (6 chữ số)')).toBeTruthy();
    expect(screen.getByTestId('confirmTwoFactorButton')).toBeTruthy();
    expect(screen.getByTestId('cancelTwoFactorButton')).toBeTruthy();
  });

  test('TC-LOGIN-08: Gọi action loginUser với mã 2FA khi nhấn Xác nhận (2FA)', () => {
    // Simulate user having already entered email and password, then backend requires 2FA
    const initialEmail = 'test2fa@example.com';
    const initialPassword = 'password2fa';

    // First, render the component in non-2FA mode to simulate inputs
    const { rerender } = renderComponent({
      auth: {
        ...mockInitialAuthState,
        // isTwoFactorRequired is false initially
      },
    });

    // Simulate typing email and password
    fireEvent.changeText(screen.getByPlaceholderText('Email'), initialEmail);
    fireEvent.changeText(screen.getByPlaceholderText('Mật khẩu'), initialPassword);
    
    // Now, simulate the state update where 2FA is required
    // This would typically happen after the initial loginUser dispatch
    // For the test, we rerender with the new store state
    store = mockStore({ // Re-initialize store with the new state for rerender
        auth: {
            ...mockInitialAuthState,
            user: null, // User is not fully logged in yet
            isTwoFactorRequired: true,
            twoFactorUserId: 'user123',
            // Crucially, the component's internal state for email/password should persist
        },
    });
    store.dispatch = jest.fn(); // Re-mock dispatch for the new store instance

    rerender(
        <Provider store={store}>
            <LoginScreen />
        </Provider>
    );
    
    expect(screen.getByTestId('twoFactorAuthTitle')).toBeTruthy(); // Ensure 2FA form is visible

    const twoFactorInput = screen.getByPlaceholderText('Mã xác thực (6 chữ số)');
    const confirmButton = screen.getByTestId('confirmTwoFactorButton');

    fireEvent.changeText(twoFactorInput, '123456');
    fireEvent.press(confirmButton);

    // LoginScreen's handleLogin will use its internal state for email and password
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  test('TC-LOGIN-09: Hiển thị lỗi khi để trống mã 2FA và nhấn Xác nhận', () => {
    renderComponent({
      auth: {
        ...mockInitialAuthState,
        isTwoFactorRequired: true,
        twoFactorUserId: 'user123',
      },
    });
    const confirmButton = screen.getByTestId('confirmTwoFactorButton');
    fireEvent.press(confirmButton);
    expect(Alert.alert).toHaveBeenCalledWith('Lỗi', 'Vui lòng nhập mã xác thực 2 yếu tố.');
  });

  test('TC-LOGIN-10: Reset 2FA và quay lại form đăng nhập khi nhấn Hủy (2FA)', async () => {
    const { rerender } = renderComponent({
      auth: {
        ...mockInitialAuthState,
        isTwoFactorRequired: true,
        twoFactorUserId: 'user123',
      },
    });

    const cancelButton = screen.getByTestId('cancelTwoFactorButton');
    fireEvent.press(cancelButton);

    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/resetTwoFactor' }));

    // Simulate store update and re-render
    // The resetTwoFactor action should set isTwoFactorRequired to false
    store = mockStore({
      auth: {
        ...mockInitialAuthState,
        isTwoFactorRequired: false, // This is the crucial change
        user: null, // Or whatever the state is after reset
      },
    });
    store.dispatch = jest.fn(); // Re-mock dispatch

    rerender(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );
    
    // Wait for the UI to update if necessary, though direct re-render should be synchronous enough
    await waitFor(() => {
        expect(screen.queryByTestId('twoFactorAuthTitle')).toBeNull();
    });
    expect(screen.getByPlaceholderText('Email')).toBeTruthy(); 
    expect(screen.getByTestId('loginTitle')).toBeTruthy(); 
  });

  test('TC-LOGIN-11: Điều hướng khi nhấn Quên mật khẩu?', () => {
    const { router } = require('expo-router');
    renderComponent();
    const forgotPasswordButton = screen.getByText('Quên mật khẩu?');
    fireEvent.press(forgotPasswordButton);
    expect(router.push).toHaveBeenCalledWith('/forgot-password');
  });

  test('TC-LOGIN-12: Điều hướng khi nhấn Đăng ký ngay', () => {
    const { router } = require('expo-router');
    renderComponent();
    const registerButton = screen.getByText('Đăng ký ngay');
    fireEvent.press(registerButton);
    expect(router.push).toHaveBeenCalledWith('/register');
  });

  test('TC-LOGIN-13: Hiển thị/ẩn mật khẩu khi nhấn icon con mắt', () => {
    renderComponent();
    const passwordInput = screen.getByPlaceholderText('Mật khẩu');
    const eyeIcon = passwordInput.parent?.parent?.findByProps({ name: 'eye' }) 
                  || passwordInput.parent?.parent?.findByProps({ name: 'eye-slash' }); // Tìm trong View cha
    
    expect(passwordInput.props.secureTextEntry).toBe(true);
    if(eyeIcon) fireEvent.press(eyeIcon);
    expect(passwordInput.props.secureTextEntry).toBe(false);
    if(eyeIcon) fireEvent.press(eyeIcon);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

}); 