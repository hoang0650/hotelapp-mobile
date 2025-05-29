import React from 'react'; // Cần cho JSX

export const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  setParams: jest.fn(),
};

export const useLocalSearchParams = jest.fn(() => ({}));
export const useGlobalSearchParams = jest.fn(() => ({}));

// Mock Link đơn giản, cần React cho JSX
export const Link = jest.fn(({ href, children }) => <a href={String(href)}>{children}</a>);

export const Stack = jest.fn(() => null); // Mock Stack component
export const Tabs = jest.fn(() => null); // Mock Tabs component

export const useNavigation = jest.fn(() => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
}));

export const useRouter = jest.fn(() => router);

// Mock các thành phần khác của expo-router nếu cần thiết khi chạy test 