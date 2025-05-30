import { combineReducers, configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// Thêm các reducers khác ở đây khi chúng được tạo
// import userReducer from './slices/userSlice';
// import hotelReducer from './slices/hotelSlice';
// import roomReducer from './slices/roomSlice';
// import bookingReducer from './slices/bookingSlice';
// import serviceReducer from './slices/serviceSlice';
// import serviceOrderReducer from './slices/serviceOrderSlice';
// import businessReducer from './slices/businessSlice';
// import staffReducer from './slices/staffSlice';
// import priceConfigReducer from './slices/priceConfigSlice';
// import pricingPackageReducer from './slices/pricingPackageSlice';
// import chatReducer from './slices/chatSlice';
// import chatMessageReducer from './slices/chatMessageSlice';
// import sepayReducer from './slices/sepaySlice';
// import otaIntegrationReducer from './slices/otaIntegrationSlice';
import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import { setGetStoreState } from './apiClient';

const rootReducer = combineReducers({
  auth: authReducer,
  // user: userReducer,
  // hotel: hotelReducer,
  // room: roomReducer,
  // booking: bookingReducer,
  // service: serviceReducer,
  // serviceOrder: serviceOrderReducer,
  // business: businessReducer,
  // staff: staffReducer,
  // priceConfig: priceConfigReducer,
  // pricingPackage: pricingPackageReducer,
  // chat: chatReducer,
  // chatMessage: chatMessageReducer,
  // sepay: sepayReducer,
  // otaIntegration: otaIntegrationReducer,
  // Thêm các slice reducers khác vào đây
});

// Mảng middleware cơ bản
const middlewares: Middleware[] = []; // Sử dụng Middleware[] từ Redux Toolkit

if (process.env.NODE_ENV === 'development') {
  // Chỉ import và sử dụng logger trong môi trường development
  const { createLogger } = require('redux-logger'); 
  
  const loggerOptions = {
    titleFormatter: (action: any, time: string, took: number) => {
      const parts = action.type.split('/');
      const module = parts.length > 1 ? parts[0].toUpperCase() : 'GENERAL';
      return `action @ ${time} [${module}] ${action.type} (in ${took.toFixed(2)} ms)`;
    },
    colors: {
      title: (action: any) => {
        if (action.type.startsWith('auth/')) return '#007bff'; // Blue for auth
        if (action.type.startsWith('booking/')) return '#28a745'; // Green for booking
        if (action.type.startsWith('room/')) return '#ffc107'; // Yellow for room
        if (action.type.startsWith('user/')) return '#6f42c1'; // Purple for user
        if (action.type.startsWith('hotel/')) return '#fd7e14'; // Orange for hotel
        // Add more colors for other slices (e.g., from @/app or other @/store features)
        return '#343a40'; // Default dark grey
      },
      prevState: () => '#adb5bd',
      action: () => '#17a2b8',
      nextState: () => '#20c997',
      error: () => '#dc3545',
    },
    collapsed: true, // Collapse logs by default for cleaner output
    diff: true, // Show diff between prev and next state
  };

  const logger = createLogger(loggerOptions);
  middlewares.push(logger as Middleware); 
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Cấu hình serializableCheck nếu cần
        // ignoredActions: ['YOUR_ACTION_TYPE'],
        // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // ignoredPaths: ['some.path.to.nonSerializableValue'],
      },
    }).concat(middlewares),
});

// Gọi setGetStoreState sau khi store đã được khởi tạo
setGetStoreState(store.getState);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Tạo và export typed hooks
export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector; 