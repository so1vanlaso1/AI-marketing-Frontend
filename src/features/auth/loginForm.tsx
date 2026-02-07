"use client";
import React, { useState } from "react";
import { useAppDispatch } from "../../lib/hooks";
import { loginSlice, ForgotPasswordSlice, resetPasswordSlice } from "./authSlice";
import { useRouter } from "@/i18n/routing";

const inputClass =
  "flex rounded-lg border border-gray-200/70 bg-white px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition  text-black";
const buttonClass =
  "inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-3 text-base font-medium text-white shadow-sm transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50";

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [fields, setFields] = useState({ username: "", password: "" });
  const [forgotFields, setForgotFields] = useState({ email: "" });
  const [resetFields, setResetFields] = useState({ newPassword: "", confirmPassword: "", resetCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<"login" | "forgot" | "reset">("login");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await (dispatch)(loginSlice(fields)).unwrap?.();
      router.push("/");
    } catch (err) {
      setError(typeof err === "string" ? err : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onChangeForgot = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotFields({ ...forgotFields, [e.target.name]: e.target.value });
  };

  const onSubmitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setLoading(true);
    try {
      await (dispatch)(ForgotPasswordSlice(forgotFields)).unwrap?.();
      setForgotSuccess("Check your email for the reset link");
      setStep("reset");
    } catch (err) {
      setForgotError(typeof err === "string" ? err : "Forgot password failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-md px-4">
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-6 sm:p-8 shadow-sm">
        {step === "login" && (
          <form onSubmit={onSubmitLogin} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center mb-2 text-White-700">Login</h2>
            {error && <div className="text-sm text-red-600 text-center">{error}</div>}
            <div>
              <label className="block mb-2 font-medium text-white-700" htmlFor="username">
                Email
              </label>
              <input
                className={inputClass + " w-full"}
                type="email"
                name="username"
                placeholder="Enter your email"
                value={fields.username}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white-700" htmlFor="password">
                Password
              </label>
              <input
                className={inputClass + " w-full"}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={fields.password}
                onChange={onChange}
                required
                minLength={6}
              />
            </div>
            <button className={buttonClass} type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setStep("forgot")}
              className="text-sm text-black-600 mt-2 underline hover:text-blue-800 transition"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Forgot Password?
            </button>
          </form>
        )}
        {step === "forgot" && (
          <form onSubmit={onSubmitForgot} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center mb-2 text-white-700">Forgot Password</h2>
            {forgotError && <div className="text-sm text-red-600 text-center">{forgotError}</div>}
            {forgotSuccess && <div className="text-sm text-green-600 text-center">{forgotSuccess}</div>}
            <div>
              <label className="block mb-2 font-medium text-white-700" htmlFor="email">
                Email
              </label>
              <input
                className={inputClass + " w-full"}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={forgotFields.email}
                onChange={onChangeForgot}
                required
              />
            </div>
            <button className={buttonClass} type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <button
              type="button"
              onClick={() => setStep("login")}
              className="text-sm text-black-500 mt-2 underline hover:text-gray-700 transition"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Back to login
            </button>
          </form>
        )}
        {step === "reset" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              if (resetFields.newPassword !== resetFields.confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
              }
              if (resetFields.resetCode.length !== 6) {
                setError("Reset code must be 6 digits");
                setLoading(false);
                return;
              }
              try {
                await (dispatch)(
                  resetPasswordSlice({
                    email: forgotFields.email,
                    password: resetFields.newPassword,
                    code: resetFields.resetCode,
                  })
                ).unwrap?.();
                // Optionally redirect or show success
                setStep("login");
              } catch (err) {
                setError(typeof err === "string" ? err : "Reset failed");
              } finally {
                setLoading(false);
              }
            }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold text-center mb-2 text-white-700">Reset Password</h2>
            {error && <div className="text-sm text-red-600 text-center">{error}</div>}
            <div>
              <label className="block mb-2 font-medium text-white-700" htmlFor="newPassword">
                New Password
              </label>
              <input
                className={inputClass + " w-full text-white "}
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={resetFields.newPassword || ""}
                onChange={e => setResetFields({ ...resetFields, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className={inputClass + " w-full text-white "}
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={resetFields.confirmPassword || ""}
                onChange={e => setResetFields({ ...resetFields, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div>
        <div
        className="flex gap-2 justify-center mb-2"
        onPaste={e => {
          e.preventDefault();
          const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
          if (!paste) return;

          setResetFields({ ...resetFields, resetCode: paste });

          // Focus last field if full code pasted
          const last = document.getElementById(`reset-code-digit-${paste.length - 1}`);
          if (last) (last as HTMLInputElement).focus();
        }}
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <input
            key={idx}
            id={`reset-code-digit-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={resetFields.resetCode[idx] || ""}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, "");
              let codeArr = resetFields.resetCode.split("");

              // Handle normal input
              codeArr[idx] = val;

              // If user pastes multiple digits into one box (e.g., via mobile autofill)
              if (val.length > 1) {
                codeArr = val.split("").slice(0, 6);
              }

              const newCode = codeArr.join("");
              setResetFields({ ...resetFields, resetCode: newCode });

              // Auto-focus next input
              if (val && idx < 5) {
                const next = document.getElementById(`reset-code-digit-${idx + 1}`);
                if (next) (next as HTMLInputElement).focus();
              }
            }}
            onKeyDown={e => {
              if (e.key === "Backspace" && !resetFields.resetCode[idx] && idx > 0) {
                const prev = document.getElementById(`reset-code-digit-${idx - 1}`);
                if (prev) (prev as HTMLInputElement).focus();
              }
            }}
            className="w-10 h-10 text-center border-b-2 border-blue-500 bg-transparent text-lg text-white focus:border-blue-700 outline-none"
            style={{ letterSpacing: "2px" }}
            autoFocus={idx === 0}
          />
        ))}
      </div>
      
      </div>
            <button className={buttonClass} type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

      
      </div>
    </div>
  );
};

export default LoginForm;