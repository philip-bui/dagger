const React = require("react");
const hoistNonReactStatics = require("hoist-non-react-statics");
const { validateInjections, reduceDependenciesToObject } = require("../inject");

const isClassComponent = Component =>
  Boolean(Component.prototype && Component.prototype.isReactComponent);

const injectProps = (...names) => {
  validateInjections(names);
  return WrappedComponent => {
    const name = `Injected.${WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component"}`;
    if (isClassComponent(WrappedComponent)) {
      const forwardRef = (props, ref) => {
        return (
          <WrappedComponent
            {...reduceDependenciesToObject(names)}
            {...props}
            ref={ref}
          />
        );
      };
      forwardRef.displayName = name;
      return hoistNonReactStatics(
        React.forwardRef(forwardRef),
        WrappedComponent
      );
    }
    const InjectedComponent = props => (
      <WrappedComponent {...reduceDependenciesToObject(names)} {...props} />
    );
    InjectedComponent.displayName = name;
    return InjectedComponent;
  };
};

module.exports = {
  isClassComponent,
  injectProps
};
