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

  describe.each([
    [
      "class components",
      class Bar extends PureComponent {
        render() {
          const { foo, bar } = this.props;
          return (
            <div>
              {foo.foo}
              {bar}
            </div>
          );
        }
      }
    ],
    [
      "functional components",
      ({ props: { foo, bar } }) => (
        <div>
          {foo.foo}
          {bar}
        </div>
      )
    ]
  ])("%s", (_, Bar) => {
    it("injects with props", () => {
      const DecoratedBar = injectProps("Foo")(Bar);
      const instance = shallow(<DecoratedBar bar="bar" />);
      expect(instance).toBeDefined();
      expect(instance.props().Foo).toEqual(new Foo());
      expect(instance.props().bar).toEqual("bar");
    });
    it("no dependencies", () => {
      expect(injectProps()(Bar)).toBeDefined();
    });
    it("throws on invalid invocation", () => {
      expect(() => injectProps(Bar)).toThrowError();
    });
  });
  describe("class components", () => {
    // @injectProps("Foo")
    // class Bar extends PureComponent {
    //   render() {
    //     return <div />;
    //   }
    // }
    it.todo("injects with ref");
  });

  describe("functional components", () => {
    const Bar = () => <div />;

    describe("displayName", () => {
      it("gets injected", () => {
        Bar.displayName = "abc";
        const instance = injectProps("Foo")(Bar);
        expect(instance.displayName).toEqual("Injected.abc");
      });

      it("defaults to Component", () => {
        Bar.displayName = "";
        Object.defineProperty(Bar, "name", {
          value: ""
        });
        const instance = injectProps("Foo")(Bar);
        expect(instance.displayName).toEqual("Injected.Component");
      });
    });
  });
});
