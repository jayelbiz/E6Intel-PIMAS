import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useFormik } from "formik";
import * as Yup from "yup";

// Custom hooks
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../services/toast";

// Images
import logo from "../../assets/images/logo.svg";
import googleIcon from "../../assets/images/google.svg";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithProvider } = useAuth();
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
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { error } = await signIn(values.email, values.password);
        if (error) throw error;
        showSuccess("Login successful", "Welcome back!");
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithProvider('google');
      if (error) throw error;
      // Callback will handle navigation
    } catch (error) {
      showError(
        "Google sign-in failed",
        error.message || "Unable to sign in with Google. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper pt-5">
      <div className="auth-page-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <Card className="mt-4">
                <div className="text-center mt-2">
                  <img src={logo} alt="Logo" height={50} className="mb-4" />
                  <h5 className="text-primary">Welcome Back!</h5>
                  <p className="text-muted">Sign in to continue to E6 Intel.</p>
                </div>

                <div className="p-4">
                  <form onSubmit={formik.handleSubmit} className="p-fluid">
                    <div className="mb-3">
                      <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-envelope" />
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
                        <small className="p-error block mt-1">{formik.errors.email}</small>
                      )}
                    </div>

                    <div className="mb-3">
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
                        <small className="p-error block mt-1">{formik.errors.password}</small>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="float-end">
                        <Link to="/forgot-password" className="text-muted">
                          Forgot password?
                        </Link>
                      </div>
                    </div>

                    <div className="mb-3">
                      <Button
                        type="submit"
                        label="Sign In"
                        icon="pi pi-user"
                        className="w-full p-button-primary"
                        loading={loading}
                      />
                    </div>

                    <Divider align="center">
                      <span className="text-muted text-uppercase">or</span>
                    </Divider>

                    <div className="mb-3">
                      <Button
                        type="button"
                        label="Sign in with Google"
                        icon="pi pi-google"
                        className="w-full p-button-secondary p-button-outlined"
                        onClick={handleGoogleSignIn}
                        loading={loading}
                      />
                    </div>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="mb-0 text-muted">Don't have an account?{' '}
                      <Link to="/register" className="fw-semibold text-primary text-decoration-underline">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ToastComponent />
    </div>
  );
};

export default Login;
