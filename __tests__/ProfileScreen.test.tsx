import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProfileScreen from '../app/(tabs)/profile'; // Điều chỉnh đường dẫn nếu cần
import { logoutUser } from '../store/slices/authSlice';

// Mock expo-router đã được thực hiện qua jest.config.js và __mocks__
// const { router } = require('expo-router'); // Để truy cập mock

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockStore = configureStore([]);

// Định nghĩa một initial state mẫu cho auth slice, bạn có thể lấy từ slice của bạn
const mockInitialAuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
    isTwoFactorRequired: false,
    twoFactorUserId: null,
};

describe('ProfileScreen', () => {
  let store: any; // Cần type rõ ràng hơn nếu có thể
  const mockUser = {
    _id: 'user123',
    username: 'testuser1',
    email: 'test1@example.com',
    fullName: 'Test User 1',
    phone: '+84123456789',
    role: 'guest',
    status: 'active', // Thêm status nếu bạn muốn test hiển thị nó
    avatar: 'https://placekitten.com/100/100',
    createdAt: new Date().toISOString(),
  };

  const renderComponent = (customStoreState?: any) => {
    store = mockStore({
      auth: {
        ...mockInitialAuthState,
        user: mockUser,
        isAuthenticated: true,
        status: 'succeeded',
        ...customStoreState?.auth,
      },
      // ... other slices if needed for ProfileScreen
    });
    // Mock lại dispatch cho mỗi lần render với store mới
    store.dispatch = jest.fn();

    return render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );
  };

  beforeEach(() => {
    // Reset mocks trước mỗi test
    jest.clearAllMocks();
    // (Alert.alert as jest.Mock).mockClear(); // Nếu spyOn Alert trực tiếp
  });

  test('TC-PROFILE-01: Hiển thị thông tin người dùng guest chính xác', () => {
    renderComponent();

    expect(screen.getByTestId('profileFullName')).toHaveTextContent(mockUser.fullName);
    expect(screen.getByTestId('profileRole')).toHaveTextContent(mockUser.role);
    expect(screen.getByTestId('profileEmail')).toHaveTextContent(mockUser.email);
    expect(screen.getByTestId('profilePhone')).toHaveTextContent(mockUser.phone);
    expect(screen.getByTestId('profileCreatedAt')).toHaveTextContent(
      new Date(mockUser.createdAt).toLocaleDateString('vi-VN')
    );
    
    const avatarImage = screen.getByTestId('profileAvatar');
    expect(avatarImage.props.source.uri).toBe(mockUser.avatar);
  });

  test('TC-PROFILE-02: Xử lý đăng xuất khi nhấn nút Đăng xuất và xác nhận', () => {
    renderComponent();
    
    const logoutButton = screen.getByText('Đăng xuất');
    fireEvent.press(logoutButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Hủy' }),
        expect.objectContaining({ text: 'Đăng xuất', style: 'destructive' }),
      ])
    );

    // Giả sử người dùng nhấn "Đăng xuất" trong Alert
    // Lấy callback của nút "Đăng xuất" từ mock call
    const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
    const logoutConfirmButton = alertArgs[2].find((button: any) => button.text === 'Đăng xuất');
    
    if (logoutConfirmButton && logoutConfirmButton.onPress) {
      logoutConfirmButton.onPress();
    }
    
    expect(store.dispatch).toHaveBeenCalledWith(logoutUser());
  });

  test('TC-PROFILE-03: Điều hướng về login nếu không xác thực', () => {
    const { router } = require('expo-router'); // Lấy mock router
    renderComponent({ 
      auth: { 
        user: null, 
        isAuthenticated: false, 
        status: 'idle' 
      } 
    });
    expect(router.replace).toHaveBeenCalledWith('/(auth)/login');
  });

  test('TC-PROFILE-04: Không hiển thị thông tin số điện thoại nếu không có', () => {
    const userWithoutPhone = { ...mockUser, phone: null };
    renderComponent({ auth: { user: userWithoutPhone }});

    expect(screen.queryByTestId('profilePhone')).toBeNull();
  });
}); 