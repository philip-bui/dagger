import React from "react";
import { validateInjections, reduceDependenciesToObject } from "../inject";

export default function InjectProps(...names) {
  validateInjections(names);
  return WrappedComponent => props => {
    return (
      <WrappedComponent {...reduceDependenciesToObject(names)} {...props} />
    );
  };
}
