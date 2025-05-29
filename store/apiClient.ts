import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:3000'; 

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Biến để giữ hàm getState, sẽ được set từ bên ngoài
let getStoreState: (() => any) | null = null;

export const setGetStoreState = (fn: () => any) => {
  getStoreState = fn;
};

// Request Interceptor: Tự động thêm token vào header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (getStoreState) {
      const token = getStoreState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      // Không tự động logout ở đây nữa, để thunks xử lý
      // if (error.response.status === 401) {
      //   // ...
      // }
      return Promise.reject(error.response.data); // Trả về phần data của lỗi để dễ xử lý hơn
    }
    // Lỗi không phải từ server (ví dụ: network error)
    console.error('API Error (No Response):', error.message);
    return Promise.reject(error);
  }
);

export default apiClient; 