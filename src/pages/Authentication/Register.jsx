import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Checkbox } from 'primereact/checkbox';

// Custom hooks
import { useAuth } from "@hooks/useAuth";
import { useToast } from "@services/toast";

// Images
import logo from "../../assets/images/logo.svg";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail, signInWithProvider } = useAuth();
  const navigate = useNavigate();
  const { ToastComponent, showSuccess, showError, showInfo } = useToast();

  // Password validation schema
  const passwordSchema = Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[^\w]/, "Password must contain at least one symbol")
    .required("Password is required");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required("First name is required"),
      lastName: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: passwordSchema,
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
      acceptTerms: Yup.boolean()
        .oneOf([true], "You must accept the terms and conditions")
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data, error } = await signUpWithEmail(
          values.email,
          values.password,
          {
            firstName: values.firstName,
            lastName: values.lastName
          }
        );

        if (error) {
          let errorMessage = "Registration failed. ";
          
          switch (error.message) {
            case "User already registered":
              errorMessage += "This email is already registered. Please try logging in.";
              break;
            case "Password is too weak":
              errorMessage += "Please choose a stronger password.";
              break;
            case "Email address is invalid":
              errorMessage += "Please enter a valid email address.";
              break;
            default:
              errorMessage += error.message || "Please try again.";
          }
          
          showError("Registration Failed", errorMessage);
          throw error;
        }

        if (data) {
          showSuccess(
            "Registration successful!", 
            "Please check your email to verify your account. You will be redirected to the login page."
          );
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        console.error("Registration error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithProvider('google');
      if (error) throw error;
    } catch (error) {
      showError(
        "Google sign-up failed",
        error.message || "Unable to sign up with Google. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordHeader = <div className="font-bold mb-3">Pick a password</div>;
  const passwordFooter = (
    <React.Fragment>
        <Divider />
        <p className="mt-2">Password must contain:</p>
        <ul className="pl-2 ml-2 mt-0 text-xs">
            <li>At least 8 characters</li>
            <li>At least one lowercase letter</li>
            <li>At least one uppercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
        </ul>
    </React.Fragment>
  );

  return (
    <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
      <ToastComponent />
      
      <div className="w-full max-w-30rem p-4">
        <Card className="shadow-4">
          <div className="text-center mb-5">
            <div className="mb-4">
              <img src={logo} alt="Logo" height={50} className="mx-auto" />
            </div>
            <h5 className="text-primary text-2xl font-medium mb-2">Create Account</h5>
            <p className="text-600 mb-0">Join E6 Intel and start analyzing.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="grid">
              <div className="col-12 md:col-6 mb-4">
                <span className="p-float-label">
                  <InputText
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    className={formik.errors.firstName && formik.touched.firstName ? 'p-invalid w-full' : 'w-full'}
                  />
                  <label htmlFor="firstName">First Name*</label>
                </span>
                {formik.errors.firstName && formik.touched.firstName && (
                  <small className="p-error">{formik.errors.firstName}</small>
                )}
              </div>

              <div className="col-12 md:col-6 mb-4">
                <span className="p-float-label">
                  <InputText
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    className={formik.errors.lastName && formik.touched.lastName ? 'p-invalid w-full' : 'w-full'}
                  />
                  <label htmlFor="lastName">Last Name*</label>
                </span>
                {formik.errors.lastName && formik.touched.lastName && (
                  <small className="p-error">{formik.errors.lastName}</small>
                )}
              </div>
            </div>

            <div className="mb-4">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-envelope" />
                <InputText
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className={formik.errors.email && formik.touched.email ? 'p-invalid w-full' : 'w-full'}
                />
                <label htmlFor="email">Email*</label>
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
                  header={passwordHeader}
                  footer={passwordFooter}
                  className={formik.errors.password && formik.touched.password ? 'p-invalid w-full' : 'w-full'}
                />
                <label htmlFor="password">Password*</label>
              </span>
              {formik.errors.password && formik.touched.password && (
                <small className="p-error">{formik.errors.password}</small>
              )}
            </div>

            <div className="mb-4">
              <span className="p-float-label">
                <Password
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  toggleMask
                  feedback={false}
                  className={formik.errors.confirmPassword && formik.touched.confirmPassword ? 'p-invalid w-full' : 'w-full'}
                />
                <label htmlFor="confirmPassword">Confirm Password*</label>
              </span>
              {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                <small className="p-error">{formik.errors.confirmPassword}</small>
              )}
            </div>

            <div className="mb-4 flex align-items-center">
              <div className="p-field-checkbox">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formik.values.acceptTerms}
                  onChange={formik.handleChange}
                  className={formik.errors.acceptTerms && formik.touched.acceptTerms ? 'p-invalid' : ''}
                />
                <label htmlFor="acceptTerms" className="ml-2">
                  I agree to the <Link to="/terms" className="text-primary font-medium">Terms & Conditions</Link>*
                </label>
              </div>
            </div>
            {formik.errors.acceptTerms && formik.touched.acceptTerms && (
              <small className="p-error block mb-4">{formik.errors.acceptTerms}</small>
            )}

            <Button
              type="submit"
              label="Create Account"
              icon="pi pi-user-plus"
              className="w-full mb-4"
              loading={loading}
            />

            <Divider align="center">
              <span className="text-600 font-normal text-sm">OR</span>
            </Divider>

            <Button
              type="button"
              label="Sign up with Google"
              icon="pi pi-google"
              severity="secondary"
              className="w-full p-button-outlined"
              onClick={handleGoogleSignUp}
              loading={loading}
            />

            <div className="text-center mt-4">
              <span className="text-600 font-normal text-sm">Already have an account? </span>
              <Link to="/login" className="text-primary font-medium">Sign In</Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
