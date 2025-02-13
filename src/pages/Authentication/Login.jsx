import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useFormik } from "formik";
import * as Yup from "yup";

// Custom hooks
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../services/toast";

// Images
import logo from "../../assets/images/logo.svg";
import lightlogo from "../../assets/images/logo-light.svg";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { ToastComponent, showSuccess, showError } = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await signIn(values.email, values.password);
        showSuccess("Welcome back!", "Login successful");
        navigate("/dashboard");
      } catch (error) {
        showError(
          "Login failed",
          error.message || "Please check your credentials and try again"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
      <ToastComponent />
      
      <div className="w-full max-w-30rem p-4">
        <Card className="shadow-2">
          <div className="text-center mb-5">
            <img src={logo} alt="logo" height="50" className="mb-3" />
            <div className="text-900 text-3xl font-medium mb-3">Welcome Back!</div>
            <span className="text-600 font-medium">Sign in to continue</span>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="mb-4">
              <span className="p-float-label">
                <InputText
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className={formik.errors.email && formik.touched.email ? 'p-invalid' : ''}
                />
                <label htmlFor="email">Email</label>
              </span>
              {formik.errors.email && formik.touched.email && (
                <small className="p-error">{formik.errors.email}</small>
              )}
            </div>

            <div className="mb-4">
              <span className="p-float-label">
                <Password
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  toggleMask
                  className={formik.errors.password && formik.touched.password ? 'p-invalid' : ''}
                  feedback={false}
                />
                <label htmlFor="password">Password</label>
              </span>
              {formik.errors.password && formik.touched.password && (
                <small className="p-error">{formik.errors.password}</small>
              )}
            </div>

            <div className="flex align-items-center justify-content-between mb-4">
              <div className="flex align-items-center">
                <Link to="/forgot-password" className="font-medium no-underline text-blue-500 cursor-pointer">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              label="Sign In"
              icon="pi pi-user"
              loading={loading}
              className="w-full"
            />

            <div className="text-center mt-4">
              <span className="text-600 font-medium">New to E6Intel? </span>
              <Link to="/register" className="font-medium no-underline text-blue-500">
                Create an account
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
