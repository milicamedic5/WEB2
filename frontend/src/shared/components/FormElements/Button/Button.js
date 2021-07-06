import React from "react";

import "./Button.css";

const Button = (props) => {
  return (
    <button
      className={`button button--${props.size || "default"} ${
        props.inverse && "button--inverse"
      } ${props.danger && "button--danger"} ${props.right && "button--right"} ${
        props.add && "button--add"
      }
      ${props.edit && "button--edit"}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
