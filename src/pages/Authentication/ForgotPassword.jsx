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
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="text-center mt-2">
          <h5 className="text-primary">Forgot Password?</h5>
          <p className="text-muted">Enter your email to reset your password</p>
        </div>

        <div className="p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <InputText
                id="email"
                name="email"
                className={classNames('w-full', {
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
                label="Reset Password"
                icon="pi pi-lock"
                loading={loading}
                className="w-full"
              />
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="mb-0">
              Remember your password? <Link to="/login" className="fw-semibold text-primary text-decoration-underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ForgotPassword;
