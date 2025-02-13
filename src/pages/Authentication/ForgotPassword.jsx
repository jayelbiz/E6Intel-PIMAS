import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { error } = await resetPassword(values.email);
        if (error) throw error;
        showSuccess(
          'Reset link sent',
          'Please check your email for password reset instructions'
        );
      } catch (error) {
        showError(
          'Reset failed',
          error.message || 'Failed to send reset link. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="auth-page-wrapper pt-5">
      <div className="auth-page-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <Card className="mt-4">
                <div className="text-center mt-2">
                  <h5 className="text-primary">Forgot Password?</h5>
                  <p className="text-muted">Enter your email to reset password</p>
                </div>

                <div className="p-4">
                  <div className="alert alert-borderless alert-warning text-center mb-2 mx-2" role="alert">
                    Enter your email and instructions will be sent to you!
                  </div>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">Email</label>
                      <InputText
                        id="email"
                        name="email"
                        className={classNames('form-control', {
                          'p-invalid': formik.touched.email && formik.errors.email,
                        })}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <small className="p-error">{formik.errors.email}</small>
                      )}
                    </div>

                    <div className="text-center mt-4">
                      <Button
                        type="submit"
                        label="Send Reset Link"
                        className="w-100"
                        loading={loading}
                      />
                    </div>
                  </form>
                </div>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">Wait, I remember my password... {" "}
                  <Link to="/login" className="fw-semibold text-primary text-decoration-underline">
                    Click here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
