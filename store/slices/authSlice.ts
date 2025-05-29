import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCurrentUser, loginUser, signupUser } from '../thunks/authThunks';
import { ApiErrorResponse, AuthState, LoginResponseData, User } from '../types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
  isTwoFactorRequired: false,
  twoFactorUserId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      state.isTwoFactorRequired = false;
      state.twoFactorUserId = null;
      AsyncStorage.removeItem('authToken');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    resetTwoFactor: (state) => {
      state.isTwoFactorRequired = false;
      state.twoFactorUserId = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.isTwoFactorRequired = false;
        state.twoFactorUserId = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponseData>) => {
        const payload = action.payload;
        if ('requireTwoFactor' in payload && payload.requireTwoFactor === true) {
          state.isTwoFactorRequired = true;
          state.twoFactorUserId = payload.userId;
          state.status = '2fa_required';
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        } else if ('token' in payload && 'user' in payload) {
          state.token = payload.token;
          state.user = payload.user;
          state.isAuthenticated = true;
          state.status = 'succeeded';
          state.isTwoFactorRequired = false;
          state.twoFactorUserId = null;
          AsyncStorage.setItem('authToken', payload.token);
        }
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<ApiErrorResponse | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || { success: false, message: 'Unknown login error' };
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.isTwoFactorRequired = false;
        state.twoFactorUserId = null;
      })
      // Signup User
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = 'succeeded'; 
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<ApiErrorResponse | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || { success: false, message: 'Unknown signup error' };
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.isTwoFactorRequired = false;
        state.twoFactorUserId = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.isTwoFactorRequired = false;
        state.twoFactorUserId = null;
        AsyncStorage.setItem('authToken', action.payload.token);
      })
      .addCase(fetchCurrentUser.rejected, (state, action: PayloadAction<ApiErrorResponse | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || { success: false, message: 'Unknown error fetching user' };
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isTwoFactorRequired = false;
        state.twoFactorUserId = null;
        AsyncStorage.removeItem('authToken');
      });
  },
});

export const { logoutUser, clearAuthError, resetTwoFactor } = authSlice.actions;
export default authSlice.reducer; 