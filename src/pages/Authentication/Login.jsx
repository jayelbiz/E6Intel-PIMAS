import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/services/toast";
import logo from "@/assets/images/logo.svg";

// Custom hooks

// Images


const Login = () => {
  const [loading, setLoading] = useState(false);
  const { signInWithEmail: signIn, signInWithProvider } = useAuth();
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
        const { data, error } = await signIn(values.email, values.password);
        
        if (error) {
          let errorMessage = "Login failed. ";
          
          // Handle specific error cases
          switch (error.message) {
            case "Invalid login credentials":
              errorMessage += "Invalid email or password.";
              break;
            case "Email not confirmed":
              errorMessage += "Please verify your email address.";
              break;
            case "Invalid email":
              errorMessage += "Please enter a valid email address.";
              break;
            default:
              errorMessage += error.message || "Please check your credentials and try again.";
          }
          
          showError("Login Failed", errorMessage);
          throw error;
        }

        if (data?.user) {
          showSuccess("Login successful", `Welcome back, ${data.user.email}!`);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Login error details:", error);
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
      // Let AuthCallback handle the navigation
    } catch (error) {
      showError(
        "Google sign-in failed",
        error.message || "Unable to sign in with Google. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper min-h-screen flex align-items-center justify-content-center">
      <div className="auth-page-content w-full">
        <div className="container">
          <div className="flex justify-content-center">
            <div className="col-12 md:col-8 lg:col-6 xl:col-5">
              <Card className="shadow-4">
                <div className="text-center mb-5">
                  <div className="mb-4">
                    <img src={logo} alt="Logo" height={50} className="mx-auto" />
                  </div>
                  <h5 className="text-primary text-2xl font-medium mb-2">Welcome Back!</h5>
                  <p className="text-600 mb-0">Sign in to continue to E6 Intel.</p>
                  <p className="text-600 mt-2">
                    New to E6 Intel?{' '}
                    <Link to="/register" className="text-primary font-medium">
                      Create an account
                    </Link>
                  </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="p-fluid">
                  <div className="mb-4">
                    <span className="p-float-label p-input-icon-right w-full">
                      <i className="pi pi-envelope" />
                      <InputText
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        className={formik.errors.email && formik.touched.email ? 'p-invalid w-full' : 'w-full'}
                      />
                      <label htmlFor="email">Email</label>
                    </span>
                    {formik.errors.email && formik.touched.email && (
                      <small className="p-error block mt-2">{formik.errors.email}</small>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="p-float-label w-full">
                      <Password
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        toggleMask
                        className={formik.errors.password && formik.touched.password ? 'p-invalid w-full' : 'w-full'}
                        feedback={false}
                        inputClassName="w-full"
                      />
                      <label htmlFor="password">Password</label>
                    </span>
                    {formik.errors.password && formik.touched.password && (
                      <small className="p-error block mt-2">{formik.errors.password}</small>
                    )}
                  </div>

                  <div className="mb-4 flex justify-content-end">
                    <Link to="/forgot-password" className="text-600 hover:text-primary no-underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    label="Sign In"
                    icon="pi pi-user"
                    className="mb-4 p-button-primary w-full"
                    loading={loading}
                  />

                  <Divider align="center" className="my-4">
                    <span className="text-600 font-medium">OR</span>
                  </Divider>

                  <Button
                    type="button"
                    severity="secondary"
                    outlined
                    className="mb-4 w-full p-button-outlined flex align-items-center justify-content-center gap-2"
                    onClick={handleGoogleSignIn}
                    loading={loading}
                  >
                    <i className="pi pi-google text-xl mr-2" />
                    <span>Continue with Google</span>
                  </Button>

                  <div className="text-center">
                    <p className="text-600 mb-0">
                      Don't have an account?{' '}
                      <Link to="/register" className="font-medium text-primary hover:underline">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
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
