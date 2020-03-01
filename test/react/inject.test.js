/* eslint-disable max-classes-per-file */
import React, { PureComponent } from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import InjectProps from "../../src/react/inject";
import { Provides } from "../../src";

Enzyme.configure({ adapter: new Adapter() });

describe("React", () => {
  @Provides
  class Foo {
    foo = "foo";
  }
  describe("class components", () => {
    @InjectProps("Foo")
    class Bar extends PureComponent {
      render() {
        return <div />;
      }
    }
    it("injects with props", () => {
      const instance = shallow(<Bar bar="bar" />);
      expect(instance).toBeDefined();
      expect(instance.props()).toEqual({
        Foo: new Foo(),
        bar: "bar"
      });
    });

    it("no dependencies", () => {
      @InjectProps()
      class NoInjection {}

      expect(new NoInjection()).toBeDefined();
    });
    it("throws on invalid", () => {
      expect(() => {
        @InjectProps
        // eslint-disable-next-line no-unused-vars
        class InvalidInjection extends React.Component {}
      }).toThrowError();
    });
  });

  describe("functional components", () => {
    const FunctionalComponent = () => <div />;
    const Bar = InjectProps("Foo")(FunctionalComponent);

    it("injects with props", () => {
      const instance = shallow(<Bar bar="bar" />);
      expect(instance).toBeDefined();
      expect(instance.props()).toEqual({
        Foo: new Foo(),
        bar: "bar"
      });
    });
  });
});
