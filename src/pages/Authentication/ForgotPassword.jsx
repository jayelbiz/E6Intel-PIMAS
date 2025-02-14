import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useFormik } from "formik";
import * as Yup from "yup";
import classNames from 'classnames';

// Custom hooks
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../services/toast";

// Images
import logo from "../../assets/images/logo.svg";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { ToastComponent, showSuccess, showError } = useToast();

  const formik = useFormik({
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
          "Reset email sent",
          "Please check your email for password reset instructions"
        );
      } catch (error) {
        showError(
          "Reset failed",
          error.message || "Unable to send reset email. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

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
                  <h5 className="text-primary text-2xl font-medium mb-2">Forgot Password?</h5>
                  <p className="text-600 mb-0">Enter your email to reset your password</p>
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
                        className={classNames('w-full', {
                          'p-invalid': formik.errors.email && formik.touched.email
                        })}
                      />
                      <label htmlFor="email">Email</label>
                    </span>
                    {formik.errors.email && formik.touched.email && (
                      <small className="p-error block mt-2">{formik.errors.email}</small>
                    )}
                  </div>

                  <Button
                    type="submit"
                    label="Reset Password"
                    icon="pi pi-lock"
                    className="mb-4 p-button-primary w-full"
                    loading={loading}
                  />

                  <div className="text-center">
                    <p className="text-600 mb-0">
                      Remember your password?{' '}
                      <Link to="/login" className="font-medium text-primary hover:underline">
                        Sign In
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

export default ForgotPassword;
