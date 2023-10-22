import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import "./Auth.css";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../ui/LoadingSpinner";
import ErrorAlert from "../../ui/ErrorAlert";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../../src/shared/hooks/form-hook";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { AuthContext } from "../../shared/context/auth-context";
import useHttpClient from "../../shared/hooks/http-hook";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:7005/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.userName);
        console.log("hi auth " + auth);
      } catch (err) {}
      //signup mode
    } else {
      try {
        const responseData = await sendRequest(
          "http://localhost:7005/api/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log(responseData);
        auth.login(responseData.userId);
        auth.setUserName(responseData.user.name);
      } catch (err) {}
    }
  };

  const switchModeHandler = (event) => {
    event.preventDefault();
    if (!isLoginMode) {
      //signup -> login (now only need email and password to be valid)
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      //login -> signup (once switched, validity of form is false as name is blank)
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  // const handleCloseAlert = () => {
  //   //clear error when we click away
  //   // setShowAlert(false);
  //   setError(undefined);
  // };
  return (
    <React.Fragment>
      {error !== undefined && <ErrorAlert error={error} onClose={clearError} />}
      <div class="flex justify-center items-center bg-gray-200 h-screen w-screen">
        {isLoading && <LoadingSpinner />}
        <div class="w-full max-w-xs">
          <form
            class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={authSubmitHandler}
          >
            {!isLoginMode && (
              <div class="mb-2">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="username"
                >
                  Username
                </label>
                <Input
                  id="name"
                  element="input"
                  type="name"
                  validators={[VALIDATOR_REQUIRE()]} //check that input is not empty
                  errorText="Please enter a username."
                  onInput={inputHandler}
                />
              </div>
            )}
            <div class="mb-2">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                Email
              </label>
              <Input
                id="email"
                element="input"
                type="email"
                validators={[VALIDATOR_EMAIL()]} //check that input is not empty
                errorText="Please enter a valid email."
                onInput={inputHandler}
              />
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                password
              </label>
              <Input
                id="password"
                element="input"
                type="password"
                placeholder="******************"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 5 characters"
                onInput={inputHandler}
              />
            </div>
            <div class="flex flex-col items-center justify-between">
              <Button blue type="submit" disabled={!formState.isValid}>
                {isLoginMode ? "Login" : "Signup"}
              </Button>
              <Link
                to="/auth"
                onClick={switchModeHandler}
                class="mt-3 inline-block align-baseline font-bold text-xs text-navy-blue hover:text-pink"
              >
                {isLoginMode
                  ? "No account yet? Create an account"
                  : "Have an account? Log in instead"}
              </Link>
              {/* <Button blue onClick={switchModeHandler}>
                {isLoginMode
                  ? "No account yet? Create an account"
                  : "Have an account? Log in instead"}
              </Button> */}
            </div>
          </form>
          <p class="text-center text-gray-500 text-xs">
            &copy;2023 In Real Time. All rights reserved.
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Auth;
