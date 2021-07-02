import React, { useEffect, useState } from "react";
import GoogleLogin from 'react-google-login';
import Button from "../../../shared/components/FormElements/Button/Button";
import Input from "../../../shared/components/FormElements/Input/Input";
import Card from "../../../shared/components/UIElements/Card/Card";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";

import "./Auth.css";
import ImageUpload from "../../../shared/components/FormElements/ImageUpload/ImageUpload";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isTeamMemberRole, setIsTeamMemberRole] = useState(false);
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
            isValid: false
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
    setIsLoginMode(prevState => !prevState);
  };

  useEffect(() => {
    if (formState.inputs.role) {
      console.log(formState.inputs.role);
      setIsTeamMemberRole(prevState => {
        return formState.inputs.role.value === "Clan ekipe" ? true : false;
      });
    }
  }, [formState.inputs.role ? formState.inputs.role.value : null, formState.inputs.role]);

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    console.log(formState.inputs);
    console.log('send it to backend!');
    console.log('approved or not?');
  };

  const responseGoogleSuccess = (response) => {
    console.log(response);
  }

  const responseGoogleFailure = (response) => {
    console.log(response);
  }

  return (
    <React.Fragment>
      <Card className={`authentication ${isLoginMode ? '' : 'authentication__signup'}`}>
        {isLoginMode && <h2>Login Required</h2>}
        {!isLoginMode && <h2>Register Account</h2>}
        <hr />
        <form className={!isLoginMode && 'form__signup'} onSubmit={authSubmitHandler}>
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
              selectOptions={[{value: "Dispecer"}, {value: "Clan ekipe"}, {value: "Radnik"}]}
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
              selectOptions={[{value: "Team1"}, {value: "Team2"}, {value: "Team3"}]}
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
        {isLoginMode && 
        (<div className="authentication__socialLogin_button"><GoogleLogin
          clientId="20750505971-rm4o3m5qtk5ra0g325v64pch5hug1qsl.apps.googleusercontent.com"
          buttonText="Continue with Google"
          onSuccess={responseGoogleSuccess}
          onFailure={responseGoogleFailure}
          cookiePolicy={'single_host_origin'}
        /></div>)}
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode && "Don't have an account? Register here."}
          {!isLoginMode && "Already have an account? Log in here."}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;