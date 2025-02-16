import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@hooks/useAuth";
import { useToast } from "@services/toast";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const { ToastComponent, showSuccess, showError } = useToast();
  const [mode, setMode] = useState('request'); // 'request' or 'reset'

  const requestFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { error } = await resetPassword(values.email);
        if (error) throw error;
        showSuccess(
          "Reset link sent",
          "Please check your email for the password reset link"
        );
      } catch (error) {
        showError(
          "Reset failed",
          error.message || "Please try again"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const resetFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { error } = await updatePassword(values.password);
        if (error) throw error;
        showSuccess("Password updated", "Your password has been reset successfully");
        navigate("/login");
      } catch (error) {
        showError(
          "Update failed",
          error.message || "Please try again"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // Check if we're on the reset page (has hash fragment)
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setMode('reset');
    }
  }, []);

  return (
    <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
      <ToastComponent />
      
      <div className="w-full max-w-30rem p-4">
        <Card className="shadow-2">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3">
              {mode === 'request' ? 'Reset Password' : 'Create New Password'}
            </div>
            <span className="text-600 font-medium">
              {mode === 'request' 
                ? 'Enter your email to receive reset instructions'
                : 'Enter your new password'}
            </span>
          </div>

          {mode === 'request' ? (
            <form onSubmit={requestFormik.handleSubmit} className="p-fluid">
              <div className="mb-4">
                <span className="p-float-label">
                  <InputText
                    id="email"
                    name="email"
                    value={requestFormik.values.email}
                    onChange={requestFormik.handleChange}
                    className={requestFormik.errors.email && requestFormik.touched.email ? 'p-invalid' : ''}
                  />
                  <label htmlFor="email">Email</label>
                </span>
                {requestFormik.errors.email && requestFormik.touched.email && (
                  <small className="p-error">{requestFormik.errors.email}</small>
                )}
              </div>

              <Button
                type="submit"
                label="Send Reset Link"
                icon="pi pi-envelope"
                loading={loading}
                className="w-full"
              />
            </form>
          ) : (
            <form onSubmit={resetFormik.handleSubmit} className="p-fluid">
              <div className="mb-4">
                <span className="p-float-label">
                  <Password
                    id="password"
                    name="password"
                    value={resetFormik.values.password}
                    onChange={resetFormik.handleChange}
                    toggleMask
                    className={resetFormik.errors.password && resetFormik.touched.password ? 'p-invalid' : ''}
                  />
                  <label htmlFor="password">New Password</label>
                </span>
                {resetFormik.errors.password && resetFormik.touched.password && (
                  <small className="p-error">{resetFormik.errors.password}</small>
                )}
              </div>

              <div className="mb-4">
                <span className="p-float-label">
                  <Password
                    id="confirmPassword"
                    name="confirmPassword"
                    value={resetFormik.values.confirmPassword}
                    onChange={resetFormik.handleChange}
                    toggleMask
                    className={resetFormik.errors.confirmPassword && resetFormik.touched.confirmPassword ? 'p-invalid' : ''}
                    feedback={false}
                  />
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                </span>
                {resetFormik.errors.confirmPassword && resetFormik.touched.confirmPassword && (
                  <small className="p-error">{resetFormik.errors.confirmPassword}</small>
                )}
              </div>

              <Button
                type="submit"
                label="Update Password"
                icon="pi pi-lock"
                loading={loading}
                className="w-full"
              />
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
