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
  const { createLogger } = require('redux-logger'); // Sử dụng require để tránh lỗi import trong production build
  const logger = createLogger({});
  middlewares.push(logger as Middleware); // Ép kiểu logger thành Middleware nếu cần
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