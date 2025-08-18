import { useState } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.email.trim() === "") {
      return setErrorMessage("Email is required!");
    } else {
      setLoading(true);
      // Call API to send password reset link
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: formData.email,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch(
        `${process.env.REACT_APP_BASE_URL}/api/forgotPassword`,
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          return response.text();
        })
        .then((result) => {
          if (result === "Email not found") {
            throw new Error("Email not found");
          }
          console.log(result);
          localStorage.setItem("otp", result);
          const templateParams = {
            to_name: "admin",
            reply_to: formData.email,
            message: result,
            from_name: "Genshifter",
          };

          emailjs
            .send(
              "service_c62rppo",
              "template_j6rvjkb",
              templateParams,
              "3431t3ufmpAbNGbqV"
            )
            .then(
              function (response) {
                console.log("SUCCESS!", response.status, response.text);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Your OTP has been successfully sent!",
                  showConfirmButton: false,
                  timer: 1500,
                });
              },
              function (error) {
                console.log("FAILED...", error);
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "oops!something goes wrong!",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            );
          setLoading(false);
          setLinkSent(true);
        })
        .catch((error) => {
          setLoading(false);
          setErrorMessage(error.message);
        });
    }
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.otp.trim() === "") {
      return setErrorMessage("OTP is required!");
    } else {
      setLoading(true);
      // Call API to verify OTP
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: formData.email,
        otp: parseInt(formData.otp),
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch(`${process.env.REACT_APP_BASE_URL}/api/verifyOTP`, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((result) => {
          console.log(result);
          setLoading(false);
          setOtpVerified(true);
        })
        .catch((error) => {
          setLoading(false);
          setErrorMessage("Invalid OTP! Please try again.");
        });
    }
  };

  const changePassword = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.newPassword.trim() === "") {
      return setErrorMessage("New password is required!");
    } else {
      setLoading(true);
      // Call API to change password
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: formData.email,
        password: formData.newPassword,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch(
        `${process.env.REACT_APP_BASE_URL}/api/updatePassword`,
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((result) => {
          console.log(result);
          setLoading(false);
          // Password changed successfully
          window.location.href = "/login";
        })
        .catch((error) => {
          setLoading(false);
          setErrorMessage("Failed to change password! Please try again.");
        });
    }
  };

  const updateFormValue = (value, updateType) => {
    setFormData({ ...formData, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
          <div>
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Forgot Password
            </h2>

            {linkSent && !otpVerified && (
              <>
                <div className="text-center mt-8">
                  <CheckCircleIcon className="inline-block w-32 text-success" />
                </div>
                <p className="my-4 text-xl font-bold text-center">OTP Sent</p>
                <p className="mt-4 mb-8 font-semibold text-center">
                  Enter the OTP sent to your email
                </p>
                <form onSubmit={(e) => verifyOtp(e)}>
                  <div className="mb-4">
                    <InputText
                      type="text"
                      defaultValue={formData.otp}
                      updateType="otp"
                      containerStyle="mt-4"
                      labelTitle="OTP"
                      updateFormValue={updateFormValue}
                    />
                  </div>
                  <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                  <button
                    type="submit"
                    className={
                      "btn mt-2 w-full btn-primary" +
                      (loading ? " loading" : "")
                    }
                  >
                    Verify OTP
                  </button>
                </form>
              </>
            )}

            {otpVerified && (
              <>
                <div className="text-center mt-8">
                  <CheckCircleIcon className="inline-block w-32 text-success" />
                </div>
                <p className="my-4 text-xl font-bold text-center">
                  OTP Verified
                </p>
                <p className="mt-4 mb-8 font-semibold text-center">
                  Enter your new password
                </p>
                <form onSubmit={(e) => changePassword(e)}>
                  <div className="mb-4">
                    <InputText
                      type="password"
                      defaultValue={formData.newPassword}
                      updateType="newPassword"
                      containerStyle="mt-4"
                      labelTitle="New Password"
                      updateFormValue={updateFormValue}
                    />
                  </div>
                  <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                  <button
                    type="submit"
                    className={
                      "btn mt-2 w-full btn-primary" +
                      (loading ? " loading" : "")
                    }
                  >
                    Change Password
                  </button>
                </form>
              </>
            )}

            {!linkSent && (
              <>
                <p className="my-8 font-semibold text-center">
                  We will send a password reset link to your email
                </p>
                <form onSubmit={(e) => submitForm(e)}>
                  <div className="mb-4">
                    <InputText
                      type="email"
                      defaultValue={formData.email}
                      updateType="email"
                      containerStyle="mt-4"
                      labelTitle="Email"
                      updateFormValue={updateFormValue}
                    />
                  </div>
                  <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                  <button
                    type="submit"
                    className={
                      "btn mt-2 w-full btn-primary" +
                      (loading ? " loading" : "")
                    }
                  >
                    Send Reset Link
                  </button>
                  <div className="text-center mt-4">
                    Don't have an account yet?{" "}
                    <button className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                      contact the owner!
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
