"use client";
import React, { useState } from "react";
import { useAppDispatch } from "../../lib/hooks";
import { RegisterSlice, activeSlice, SetPasswordSlice } from "./authSlice";

interface RegisterPayload {
  email: string;
}
interface SetPasswordPayload {
  password: string;
  confirmPassword: string;
}
const inputClass =
  "flex rounded-lg border border-gray-200/70 bg-white px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition text-black";
const buttonClass =
  "inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-3 text-base font-medium text-white shadow-sm transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50";

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [fields, setFields] = useState<RegisterPayload>({
    email: "",
  });
  const [fieldsPassword, setFieldsPassword] = useState<SetPasswordPayload>({
    password: "",
    confirmPassword: "",
  });
  // Password fields
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldsPassword({ ...fieldsPassword, [e.target.name]: e.target.value });
  };

  const [step, setStep] = useState<"register" | "otp" | "SetPassword">("register");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const registeredEmail = fields.email;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };
  const onSubmitSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (fieldsPassword.password !== fieldsPassword.confirmPassword) {
      setError("Password and Confirm Password do not match");
      setLoading(false);
      return;
    }
    try {
      await dispatch(SetPasswordSlice({ password: fieldsPassword.password })).unwrap?.();
      // Redirect to login or home page after setting password
      window.location.href = "auth/login"; // Adjust the URL as needed
    } catch (err) {
      setError(typeof err === "string" ? err : "Setting password failed");
    } finally {
      setLoading(false);
    }
  };
  const onSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await dispatch(RegisterSlice(fields)).unwrap?.();
      setStep("otp");
    } catch (err) {
      setError(typeof err === "string" ? err : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setOtpSuccess(false);
    setVerifying(true);
    try {
      await dispatch(activeSlice({ email: registeredEmail, code: otp })).unwrap?.();
      setOtpSuccess(true);
      setStep("SetPassword");
    } catch (err) {
      setOtpError(typeof err === "string" ? err : "Invalid code");
    } finally {
      setVerifying(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    setOtpError(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.error(err);
      setOtpError("Failed to resend");
    } finally {
      setResending(false);
    }
  };
  if (step === "SetPassword") {
    return (
      <div className="mx-auto mt-8 w-full max-w-md px-4">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-6 sm:p-8 shadow-sm">
          <form onSubmit={onSubmitSetPassword} className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-center text-blue-900">Set New Password</h3>

            <label className="block mb-2 font-medium text-white-700" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="New Password"
              value={fieldsPassword.password}
              onChange={onChangePassword}
              required
              minLength={6}
              className={inputClass + " w-full"}
            />

            <label className="block mb-2 font-medium text-white-700" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={fieldsPassword.confirmPassword}
              onChange={onChangePassword}
              required
              minLength={6}
              className={inputClass + " w-full"}
            />

            {error && <div className="text-sm text-red-600 text-center">{error}</div>}

            <button
              type="submit"
              disabled={loading || !fieldsPassword.password || !fieldsPassword.confirmPassword}
              className={buttonClass}
            >
              {loading ? "Setting..." : "Set Password"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="mx-auto mt-8 w-full max-w-md px-4">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-6 sm:p-8 shadow-sm">
          <form onSubmit={onSubmitOtp} className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-center text-blue-900">Enter OTP</h3>
            <p className="text-sm text-gray-600 text-center">
              We sent a code to <strong>{registeredEmail}</strong>
            </p>

            <input
              inputMode="numeric"
              pattern="[0-9]*"
              name="otp"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className={inputClass + " w-full text-center tracking-widest"}
            />

            {otpError && <div className="text-sm text-red-600 text-center">{otpError}</div>}
            {otpSuccess && <div className="text-sm text-green-600 text-center">Verified successfully.</div>}

            <button type="submit" disabled={verifying || otp.length < 4} className={buttonClass}>
              {verifying ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={onResend}
              disabled={resending}
              className="text-sm text-blue-600 underline hover:text-blue-500 transition disabled:opacity-60"
            >
              {resending ? "Resending..." : "Resend code"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("register");
                setOtp("");
                setOtpError(null);
              }}
              className="text-sm text-gray-600 underline hover:text-gray-500 transition"
            >
              Back to registration
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-md px-4">
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-6 sm:p-8 shadow-sm">
        <form onSubmit={onSubmitRegister} className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-center text-blue-900">Create Account</h3>

          <label className="block font-medium text-white-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={fields.email}
            onChange={onChange}
            required
            className={inputClass + " w-full"}
          />
          {error && <div className="text-sm text-red-600 text-center" aria-live="polite">{error}</div>}

          <button
            type="submit"
            disabled={loading || !fields.email}
            className={buttonClass}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;