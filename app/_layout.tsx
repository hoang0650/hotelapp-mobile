import { Stack } from "expo-router";
import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from '../store'; // Đường dẫn tới store của bạn

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ title: 'Đăng nhập', headerShown: false }} />
          <Stack.Screen name="(auth)/register" options={{ title: 'Đăng ký', headerShown: false }} /> 
          <Stack.Screen name="(auth)/forgot-password" options={{ title: 'Quên mật khẩu', presentation: 'modal', headerShown: false }}/>
          <Stack.Screen name="(auth)/reset-password" options={{ title: 'Đặt lại mật khẩu', presentation: 'modal', headerShown: false }}/>
          {/* Thêm các Stack.Screen khác nếu cần */}
        </Stack>
      </GestureHandlerRootView>
    </Provider>
  );
}
