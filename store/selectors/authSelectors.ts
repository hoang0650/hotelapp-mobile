import { RootState } from '../index'; // Import RootState từ store chính
import { AuthState } from '../types'; // Import AuthState

export const selectAuthState = (state: RootState): AuthState => state.auth;

export const selectCurrentUser = (state: RootState) => selectAuthState(state).user;
export const selectIsAuthenticated = (state: RootState) => selectAuthState(state).isAuthenticated;
export const selectAuthToken = (state: RootState) => selectAuthState(state).token;
export const selectAuthStatus = (state: RootState) => selectAuthState(state).status;
export const selectAuthError = (state: RootState) => selectAuthState(state).error;
export const selectIsTwoFactorRequired = (state: RootState): boolean => selectAuthState(state).isTwoFactorRequired;
export const selectTwoFactorUserId = (state: RootState): string | null => selectAuthState(state).twoFactorUserId; 