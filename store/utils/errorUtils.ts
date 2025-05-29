import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types'; // Đảm bảo đường dẫn import đúng

// Helper function để xử lý và chuẩn hóa lỗi API
export const handleApiError = (error: unknown): ApiErrorResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>; 
    if (axiosError.response && axiosError.response.data) {
      // Nếu lỗi từ interceptor (đã là error.response.data có cấu trúc ApiErrorResponse)
      // hoặc nếu response.data có cấu trúc ApiErrorResponse
      if (typeof axiosError.response.data === 'object' && 
          axiosError.response.data !== null && 
          'message' in axiosError.response.data) {
        return {
            success: false, 
            message: (axiosError.response.data as ApiErrorResponse).message || 'An unknown API error occurred',
            error: (axiosError.response.data as ApiErrorResponse).error,
            status: axiosError.response.status
        };
      }
      // Nếu response.data không phải là object mong muốn (ví dụ: một chuỗi lỗi HTML, XML)
      return { success: false, message: String(axiosError.response.data), status: axiosError.response.status };
    }
    // Lỗi không có response (ví dụ: network error, CORS, timeout)
    return { success: false, message: axiosError.message || 'Network error or no response from server' };
  }
  // Lỗi JavaScript thông thường
  if (error instanceof Error) {
    return { success: false, message: error.message };
  }
  // Trường hợp lỗi không xác định (ví dụ: throw 'some string error')
  return { success: false, message: typeof error === 'string' ? error : 'An unexpected error occurred' };
}; 