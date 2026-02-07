import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../lib/withType';
import { axiosUser } from '../../axios/axiosUser';
import { AxiosError } from 'axios';
interface UsersData {
    userId: string;
    userName: string;
    email: string;
    password: string;
    securityStamp: string;
    isEmailActivate: boolean;
    phone: string;
    isPhoneActivate: boolean;
    lastActivityDate: string;
    lastIpAddress: string;
    isLogin: boolean;
    onlineStatus: number;
    device: string;
    firstName: string;
    lastName: string;
    birthday: string;
    gender: string;
    address: string;
    status: string;
    errorLogin: number;
    avatar: string;
    background: string;
    createDate: string;
    updateDate: string;
    createBy: string;
    updateBy: string;
    otp: string;
    otpExpires: string;
    otpAttempts: number;
    lockedUntil: string;
    isOnline: boolean;
    leftTime: string;
    displayName: string;
}

interface AllUsers {
    users: UsersData[];
    totalRecords: number;
    status?: 'idle' | 'loading' | 'succeeded' | 'failed';
}




const initialState: AllUsers = {
    users: [],
    totalRecords: 0,
    status: 'idle',
};


export const getUsersData = createAppAsyncThunk(
  'user/getUsersData',
  async () => {
    try {

      const response = await axiosUser.get('/Account/Users');
      console.log(response.status);

      // Transform the API response to match your state structure
      return {
        users: response.data.data,
        totalRecords: response.data.totalRecords
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.status);
        throw error.response?.data ?? error.message ?? "An unknown error occurred";
      }

      if (error instanceof Error) {
        throw error.message;
      }

      throw "An unknown error occurred";
    }
  },
  {
    condition(arg, thunkApi) {
      const postsStatus = selectPostsStatus(thunkApi.getState())
      if (postsStatus !== 'idle') {
        return false
      }
    }
  }
);

// ...existing code...

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(getUsersData.pending, (state) => {
      // Optionally handle loading state
      state.status = 'loading';
      console.log('Fetching users data...');
    });

    builder.addCase(getUsersData.fulfilled, (state, action: PayloadAction<AllUsers>) => {
      state.users = action.payload.users;
      state.totalRecords = action.payload.totalRecords;
      state.status = 'succeeded';
      console.log('Users data fetched successfully:', action.payload);
    });
    
    builder.addCase(getUsersData.rejected, (state, action) => {
      console.error('Failed to fetch users:', action.error.message);
      console.error('Full error:', action.error);
    });
  },
});
export const selectPostsStatus = (state: { user: AllUsers }) => state.user.status;
export const selectAllUsers = (state: { user: AllUsers }) => state.user.users;
export default userSlice.reducer;