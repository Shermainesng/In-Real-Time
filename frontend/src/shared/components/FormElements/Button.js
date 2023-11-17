import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  if (props.href) {
    return (
      <a
        className={`button button--${props.size || "default"} ${
          props.inverse && "button--inverse"
        } ${props.danger && "button--danger"}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`button
        ${
          props.yellow &&
          "border-2 border-navy-blue bg-bright-yellow text-navy-blue mt-4 py-2 no-underline"
        } 
        ${
          props.blue &&
          "bg-navy-blue hover:bg-pink text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        }
       `}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`button
      ${
        props.yellow &&
        "w-2/3 border-2 border-navy-blue bg-bright-yellow text-navy-blue mt-4 py-2 no-underline"
      }
      ${
        props.blue &&
        "bg-navy-blue hover:bg-pink text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      }`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
