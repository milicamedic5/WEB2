import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import GoogleLogin from "react-google-login";
import Button from "../../../shared/components/FormElements/Button/Button";
import Input from "../../../shared/components/FormElements/Input/Input";
import Card from "../../../shared/components/UIElements/Card/Card";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import "./Auth.css";
import ImageUpload from "../../../shared/components/FormElements/ImageUpload/ImageUpload";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isTeamMemberRole, setIsTeamMemberRole] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          lastname: undefined,
          username: undefined,
          birthday: undefined,
          role: undefined,
          address: undefined,
          confirmPassword: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
          lastname: {
            value: "",
            isValid: false,
          },
          username: {
            value: "",
            isValid: false,
          },
          birthday: {
            value: "",
            isValid: false,
          },
          role: {
            value: "Dispecer",
            isValid: false,
          },
          address: {
            value: "",
            isValid: false,
          },
          confirmPassword: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevState) => !prevState);
  };

  useEffect(() => {
    if (formState.inputs.role) {
      console.log(formState.inputs.role);
      setIsTeamMemberRole((prevState) => {
        return formState.inputs.role.value === "Clan ekipe" ? true : false;
      });
    }
  }, [formState.inputs.role]);

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/auth/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log(responseData);
        auth.login(responseData.userId, responseData.token, responseData.role);
      } catch (error) {
        console.log(error);
      }
    } else {
      const formData = new FormData();
      formData.append("Email", formState.inputs.email.value);
      formData.append("FirstName", formState.inputs.name.value);
      formData.append("LastName", formState.inputs.lastname.value);
      formData.append("Birthday", formState.inputs.birthday.value);
      formData.append("Password", formState.inputs.password.value);
      formData.append(
        "ConfirmPassword",
        formState.inputs.confirmPassword.value
      );
      formData.append("Role", formState.inputs.role.value);
      formData.append("Address", formState.inputs.address.value);
      //formData.append('image', formState.inputs.image.value);
      try {
        await sendRequest(
          "http://localhost:5000/api/auth/signup",
          "POST",
          formData
        );
      } catch (err) {}
    }
    console.log(formState.inputs);
    console.log("approved or not?");
  };

  const responseGoogleSuccess = (response) => {
    console.log(response);
  };

  const responseGoogleFailure = (response) => {
    console.log(response);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && (
        <Card
          className={`authentication ${
            isLoginMode ? "" : "authentication__signup"
          }`}
        >
          {isLoginMode && <h2>Login Required</h2>}
          {!isLoginMode && <h2>Register Account</h2>}
          <hr />
          <form
            className={!isLoginMode && "form__signup"}
            onSubmit={authSubmitHandler}
          >
            {!isLoginMode && (
              <Input
                id="name"
                element="input"
                label="First Name"
                type="text"
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name."
              />
            )}
            {!isLoginMode && (
              <Input
                id="lastname"
                element="input"
                label="Last Name"
                type="text"
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a lastname."
              />
            )}
            {!isLoginMode && (
              <Input
                id="username"
                element="input"
                label="Username"
                type="text"
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a username."
              />
            )}
            <Input
              id="email"
              label="Email"
              type="email"
              element="input"
              onInput={inputHandler}
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email."
            />
            <Input
              id="password"
              label="Password"
              type="password"
              element="input"
              onInput={inputHandler}
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Password should be at least 6 characters long."
            />
            {!isLoginMode && (
              <Input
                id="confirmPassword"
                element="input"
                label="Confirm Password"
                type="password"
                onInput={inputHandler}
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Password should be at least 6 characters long."
              />
            )}
            {!isLoginMode && (
              <Input
                id="birthday"
                element="input"
                label="Birthday"
                type="date"
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please pick your birthday."
              />
            )}
            {!isLoginMode && (
              <Input
                id="address"
                element="input"
                label="Address"
                type="text"
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter an address."
              />
            )}
            {!isLoginMode && (
              <Input
                id="role"
                element="select"
                label="Role"
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please pick a role."
                initialValue="Dispecer"
                initialValid={true}
                selectOptions={[
                  { value: "Dispecer" },
                  { value: "Clan ekipe" },
                  { value: "Radnik" },
                ]}
              />
            )}
            {!isLoginMode && isTeamMemberRole && (
              <Input
                id="team"
                element="select"
                label="Team"
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please pick a team."
                selectOptions={[
                  { value: "Team1" },
                  { value: "Team2" },
                  { value: "Team3" },
                ]}
              />
            )}
            {!isLoginMode && (
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText="Please provide an image."
                className="authentication__imageUpload"
              />
            )}
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode && "LOGIN"}
              {!isLoginMode && "SIGNUP"}
            </Button>
          </form>
          {isLoginMode && (
            <div className="authentication__socialLogin_button">
              <GoogleLogin
                clientId="20750505971-rm4o3m5qtk5ra0g325v64pch5hug1qsl.apps.googleusercontent.com"
                buttonText="Continue with Google"
                onSuccess={responseGoogleSuccess}
                onFailure={responseGoogleFailure}
                cookiePolicy={"single_host_origin"}
              />
            </div>
          )}
          <Button inverse onClick={switchModeHandler}>
            {isLoginMode && "Don't have an account? Register here."}
            {!isLoginMode && "Already have an account? Log in here."}
          </Button>
        </Card>
      )}
    </React.Fragment>
  );
};

export default Auth;
