/* eslint-disable max-classes-per-file */
import React, { PureComponent } from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { injectProps } from "../../src/react";
import { singleton } from "../../src";

Enzyme.configure({ adapter: new Adapter() });

describe("React", () => {
  @singleton
  class Foo {
    foo = "foo";
  }
  describe("class components", () => {
    @injectProps("Foo")
    class Bar extends PureComponent {
      render() {
        return <div />;
      }
    }
    it("injects with props", () => {
      const ref = React.createRef();
      const instance = shallow(<Bar bar="bar" ref={ref} />);
      expect(instance).toBeDefined();
      expect(instance.props()).toEqual({
        Foo: new Foo(),
        bar: "bar"
      });
    });

    it("no dependencies", () => {
      @injectProps()
      class NoInjection {}

      expect(new NoInjection()).toBeDefined();
    });
    it("throws on invalid", () => {
      expect(() => {
        @injectProps
        // eslint-disable-next-line no-unused-vars
        class InvalidInjection extends React.Component {}
      }).toThrowError();
    });
  });

  describe("functional components", () => {
    const FunctionalComponent = () => <div />;
    const Bar = injectProps("Foo")(FunctionalComponent);

    it("injects with props", () => {
      const instance = shallow(<Bar bar="bar" />);
      expect(instance).toBeDefined();
      expect(instance.props()).toEqual({
        Foo: new Foo(),
        bar: "bar"
      });
    });

    describe("displayName", () => {
      it("gets injected", () => {
        FunctionalComponent.displayName = "abc";
        const instance = injectProps("Foo")(FunctionalComponent);
        expect(instance.displayName).toEqual("Injected.abc");
      });

      it("defaults to Component", () => {
        FunctionalComponent.displayName = "";
        Object.defineProperty(FunctionalComponent, "name", {
          value: ""
        });
        const instance = injectProps("Foo")(FunctionalComponent);
        expect(instance.displayName).toEqual("Injected.Component");
      });
    });
  });
});
