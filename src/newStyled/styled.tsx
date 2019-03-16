import * as React from "react";
import { getClass } from "./getClass";

export const styled = Component => {
  return function(...styles) {
    return props => (
      <Component {...props} className={getClass(resolveWith(props, styles))} />
    );
  };
};

function resolveWith(props, args) {
  const result = [];
  const parts = args[0];

  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);

    const part = args[i + 1];

    if (part) {
      result.push(typeof part === "function" ? part(props) : part);
    }
  }

  return result.join("");
}

(styled as any).div = styles => styled("div")(styles);
