import React from "react";
import { resolve } from "..";

export default function InjectProps(...names) {
  names.forEach(name => {
    if (typeof name !== "string") {
      throw new Error(`Unexpected dependency ${name}`);
    }
  });
  return WrappedComponent => props => {
    const injections = {};
    names.forEach(name => {
      injections[name] = resolve(name);
    });
    return <WrappedComponent {...injections} {...props} />;
  };
}
