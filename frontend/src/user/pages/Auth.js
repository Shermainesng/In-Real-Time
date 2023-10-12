import React, { useCallback, useReducer } from "react";
import "./Auth.css";
import { AuthContext } from "../../shared/context/auth-context";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";
import { useForm } from "../../../src/shared/hooks/form-hook";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Auth = () => {
  const [formState, inputHandler] = useForm(
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

  const authSubmitHandler = (event) => {
    event.preventDefault();
    console.log("INPUT HERE " + formState.inputs);
  };

  return (
    <div class="flex justify-center items-center bg-gray-200 h-screen w-screen">
      <div class="w-full max-w-xs">
        <form
          class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={authSubmitHandler}
        >
          <div class="mb-4">
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
              Password
            </label>
            <Input
              id="password"
              element="input"
              type="password"
              placeholder="******************"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid password, at least 5 characters"
              onInput={inputHandler}
            />
          </div>
          <div class="flex items-center justify-between">
            <Button blue type="submit" disabled={!formState.isValid}>
              Log In
            </Button>
            <Link
              class="inline-block align-baseline font-bold text-sm text-navy-blue hover:text-pink"
              href="#"
            >
              Forgot Password?
            </Link>
            {/* <button onClick={switchModeHandler}>
              No account yet? Create an account
            </button> */}
          </div>
        </form>
        <p class="text-center text-gray-500 text-xs">
          &copy;2023 In Real Time. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Auth;
