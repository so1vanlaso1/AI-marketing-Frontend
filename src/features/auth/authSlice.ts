import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../lib/withType";
import { axiosAuthorization } from "../../axios/axiosAuthorization";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

interface AuthState {
  isAuthenticated: boolean;
  user: null;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}



interface UserRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  email: string;
}

interface ActiveRequest {
  email: string;
  code: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface SetPasswordRequest {
  password: string;
}

interface ResetPasswordRequest {
  email: string;
  password: string;
  code: string;
}


// ...existing code...
const getInitialAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      user: null,
      status: "idle",
      error: null,
    };
  }

  const storedToken = localStorage.getItem("accessToken") ?? Cookies.get("accessToken");
  return {
    isAuthenticated: Boolean(storedToken),
    user: null,
    status: "idle",
    error: null,
  };
};

const initialState: AuthState = getInitialAuthState();
// ...existing code...

const parseAxiosError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return typeof error.response?.data === "string" ? error.response.data : error.message || "Request failed";
  }
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
};

export const loginSlice = createAppAsyncThunk(
  "auth/login",
  async ({ username, password }: UserRequest, thunkAPI) => {
    try {
      const response = await axiosAuthorization.post(
        "/Auth/login",
        { username, password },
        { headers: { "x-skip-auth": "true" } }
      );
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(parseAxiosError(error));
    }
  }
);

export const RegisterSlice = createAppAsyncThunk(
  "auth/register",
  async ({ email }: RegisterRequest, thunkAPI) => {
    try {
      const response = await axiosAuthorization.post("/Auth/register", { email }, { headers: { "x-skip-auth": "true" } });
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(parseAxiosError(error));
    }
  }
);

export const activeSlice = createAppAsyncThunk(
  "auth/active",
  async ({ email, code }: ActiveRequest, thunkAPI) => {
    try {
      const response = await axiosAuthorization.post("/Auth/active", { email, code }, { headers: { "x-skip-auth": "true" } });
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(parseAxiosError(error));
    }
  }
);

export const ForgotPasswordSlice = createAppAsyncThunk(
  "auth/ForgotPassword",
  async ({ email }: ForgotPasswordRequest, thunkAPI) => {
    try {
      const response = await axiosAuthorization.post("/Auth/ForgotPassword", { email }, { headers: { "x-skip-auth": "true" } });
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(parseAxiosError(error));
    }
  }
);

export const SetPasswordSlice = createAppAsyncThunk(
  "Account/UserSelf/SetPassword",
  async ({ password }: SetPasswordRequest, thunkAPI) => {
    try {
      const response = await axiosAuthorization.post("/Account/UserSelf/SetPassword", JSON.stringify(password));
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(parseAxiosError(error));
    }
  }
);

export const resetPasswordSlice = createAppAsyncThunk(
  "auth/ResetPassword",
  async ({ email, password, code }: ResetPasswordRequest, thunkAPI) => {
    try {
      const response = await axiosAuthorization.post("/Auth/ResetPassword", { email, password, code }, { headers: { "x-skip-auth": "true" } });
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(parseAxiosError(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginSlice.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(loginSlice.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.isAuthenticated = true;
      state.user = action.payload.user ?? state.user;
      const accessToken = action.payload.accessToken;
      const refreshToken = action.payload.refreshToken;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        Cookies.set("accessToken", accessToken);
      }
      if (refreshToken) Cookies.set("refreshToken", refreshToken);
      state.error = null;
    });
    builder.addCase(loginSlice.rejected, (state, action) => {
      state.status = "failed";
      state.error = (action.payload as string) || action.error.message || "Login failed";
      state.isAuthenticated = false;
    });

    builder.addCase(activeSlice.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(activeSlice.fulfilled, (state, action) => {
      const accessToken = action.payload.accessToken;
      const refreshToken = action.payload.refreshToken;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        Cookies.set("accessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        Cookies.set("refreshToken", refreshToken);
      }
      state.status = "succeeded";
      state.isAuthenticated = true;
      state.user = action.payload.user ?? state.user;
      state.error = null;
    });
    builder.addCase(activeSlice.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(RegisterSlice.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(RegisterSlice.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(RegisterSlice.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(ForgotPasswordSlice.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(ForgotPasswordSlice.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(ForgotPasswordSlice.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(resetPasswordSlice.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(resetPasswordSlice.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(resetPasswordSlice.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;