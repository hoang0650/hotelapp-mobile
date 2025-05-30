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
      const response = await apiClient.post<
        LoginSuccessUserData | // For direct {token, user, message}
        TwoFactorRequiredData | // For direct {requireTwoFactor, userId}
        ApiResponse<LoginResponseData> | // For wrapped {success, data, message}
        ApiErrorResponse // For {success: false, message}
      >(
        API_ENDPOINTS.LOGIN,
        credentials
      );

      const responseData = response.data;

      // Priority 1: Direct LoginSuccessUserData (e.g., { message, token, user })
      if (responseData && 'token' in responseData && 'user' in responseData && typeof (responseData as any).token === 'string') {
        const successData = responseData as LoginSuccessUserData; // Contains token and user, might have extra fields like message
        await AsyncStorage.setItem('authToken', successData.token);
        // Return only the properties defined in LoginSuccessUserData for the slice
        return { token: successData.token, user: successData.user };
      }
      // Priority 2: Direct TwoFactorRequiredData
      else if (responseData && 'requireTwoFactor' in responseData && (responseData as any).requireTwoFactor === true && 'userId' in responseData) {
        return responseData as TwoFactorRequiredData;
      }
      // Priority 3: Wrapped ApiResponse (e.g., { success: true, data: { token, user }, message })
      else if (responseData && 'success' in responseData && typeof (responseData as any).success === 'boolean') {
        const apiResp = responseData as ApiResponse<LoginResponseData>; // success, data, message
        if (apiResp.success && apiResp.data) {
          const nestedData = apiResp.data; // LoginResponseData: LoginSuccessUserData | TwoFactorRequiredData
          if ('token' in nestedData && 'user' in nestedData) {
            await AsyncStorage.setItem('authToken', (nestedData as LoginSuccessUserData).token);
            return nestedData as LoginSuccessUserData;
          } else if ('requireTwoFactor' in nestedData && (nestedData as TwoFactorRequiredData).requireTwoFactor === true) {
            return nestedData as TwoFactorRequiredData;
          } else {
            // success: true, but data inside is not in expected format for LoginResponseData
            return rejectWithValue(handleApiError({ 
              message: apiResp.message || 'Login successful but server data format is unexpected.' 
            }));
          }
        } else {
          // success: false from API
          return rejectWithValue({
            success: false,
            message: apiResp.message || 'Login failed as per API response (success:false)',
            error: apiResp.error
          } as ApiErrorResponse);
        }
      }
      // Priority 4: Unrecognized successful response structure (status 200 but unexpected payload)
      else {
        return rejectWithValue(handleApiError({ 
          message: 'Login seemed successful (status 200) but the server response data format was unrecognized.' 
        }));
      }
    } catch (error: unknown) {
      // Handles Axios errors (network, HTTP status codes >= 300) processed by handleApiError.
      // The interceptor might have already transformed error.response.data.
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
      const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USER_INFO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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