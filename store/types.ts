// store/types.ts

// Kiểu dữ liệu chung cho response từ API của bạn
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string; 
}

// Định nghĩa kiểu dữ liệu cho User 
export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  role?: 'superadmin' | 'admin' | 'business' | 'hotel' | 'staff' | 'guest';
  status?: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  preferences?: {
    language?: string;
    theme?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- Auth Specific Types ---
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | '2fa_required';
  error: ApiErrorResponse | null;
  isTwoFactorRequired: boolean;
  twoFactorUserId: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface LoginSuccessUserData {
  token: string;
  user: User;
}

export interface TwoFactorRequiredData {
  requireTwoFactor: true;
  userId: string;
}

export type LoginResponseData = LoginSuccessUserData | TwoFactorRequiredData;

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  role?: User['role'];
}

// --- API Error and Thunk Config Types ---
export interface ApiErrorResponse {
  success: boolean; 
  message: string;
  error?: string;   
  status?: number;  
}

// Kiểu cho rejectValue và các tùy chỉnh khác của async thunks
export interface AppThunkApiConfig {
  /**
   * Kiểu trả về cho rejectWithValue.
   */
  rejectValue: ApiErrorResponse;
  /**
   * Các kiểu này thường được Redux Toolkit tự suy luận từ store.
   * state: RootState;
   * dispatch: AppDispatch;
   * extra?: unknown;
   * serializedErrorType?: unknown;
   */
}

// Bạn có thể thêm các kiểu chung khác cho Hotel, Room, Booking, v.v. ở đây
// export interface Hotel { ... } 