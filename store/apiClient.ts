import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from './index';
import { logoutUser } from './slices/authSlice';

const API_BASE_URL = 'http://localhost:3000/api'; 

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động thêm token vào header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token; // Lấy token từ Redux state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi chung
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // Trả về response nếu thành công
  (error: AxiosError) => {
    // Xử lý lỗi cụ thể ở đây nếu cần
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      // Nếu lỗi là 401 Unauthorized (token hết hạn/không hợp lệ), tự động logout
      if (error.response.status === 401) {
        // Kiểm tra để tránh vòng lặp vô hạn nếu API logout cũng trả về 401
        if (!error.config?.url?.includes('/users/login')) { // Hoặc đường dẫn API logout của bạn
          store.dispatch(logoutUser());
          // Có thể điều hướng người dùng về màn hình login ở đây nếu cần
          // alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
      }
      // Bạn có thể ném lại lỗi để xử lý cụ thể ở từng async thunk
      // hoặc trả về một cấu trúc lỗi chuẩn hóa
      return Promise.reject(error.response.data); // Trả về phần data của lỗi để dễ xử lý hơn
    }
    // Lỗi không phải từ server (ví dụ: network error)
    console.error('API Error (No Response):', error.message);
    return Promise.reject(error);
  }
);

export default apiClient; 