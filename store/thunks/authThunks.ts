import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../apiEndpoints';
import {
  ApiErrorResponse,
  ApiResponse,
  AppThunkApiConfig,
  LoginRequest,
  LoginResponseData,
  LoginSuccessUserData,
  SignupRequest,
  TwoFactorRequiredData,
  User
} from '../types';
import { handleApiError } from '../utils/errorUtils';

export const loginUser = createAsyncThunk<
  LoginSuccessUserData | TwoFactorRequiredData,
  LoginRequest,
  AppThunkApiConfig
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponseData>>(
        API_ENDPOINTS.LOGIN,
        credentials
      );

      if (response.data.success) {
        const responseData = response.data.data;
        if ('requireTwoFactor' in responseData && responseData.requireTwoFactor === true) {
          return responseData as TwoFactorRequiredData;
        } else if ('token' in responseData && 'user' in responseData) {
          const successData = responseData as LoginSuccessUserData;
          await AsyncStorage.setItem('authToken', successData.token);
          return successData;
        } else {
          return rejectWithValue(handleApiError({ message: 'Invalid successful login response structure' }));
        }
      } else {
        return rejectWithValue({ 
            success: false, 
            message: response.data.message || 'Login failed due to server logic (success:false)', 
            error: response.data.error 
        } as ApiErrorResponse);
      }
    } catch (error: unknown) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError);
    }
  }
);

export const signupUser = createAsyncThunk<
  string, 
  SignupRequest,
  AppThunkApiConfig
>(
  'auth/signupUser',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        API_ENDPOINTS.SIGNUP,
        userData
      );
      if (response.data.success) {
        return response.data.message || 'Signup successful';
      } else {
        return rejectWithValue({ 
            success: false, 
            message: response.data.message || 'Signup failed', 
            error: response.data.error 
        } as ApiErrorResponse);
      }
    } catch (error: unknown) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<
  { user: User; token: string },
  void, 
  AppThunkApiConfig
>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue({ success: false, message: 'No token found, user needs to login.' } as ApiErrorResponse);
      }
      const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USER_INFO);

      if (response.data.success && response.data.data) {
        return { user: response.data.data, token };
      } else {
        return rejectWithValue({ 
            success: false, 
            message: response.data.message || 'Invalid token or failed to fetch user data.',
            error: response.data.error 
        } as ApiErrorResponse);
      }
    } catch (error: unknown) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError);
    }
  }
); 