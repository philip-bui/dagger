# Dagger
[![Actions Status](https://github.com/philip-bui/dagger/workflows/build/badge.svg)](https://github.com/philip-bui/dagger/actions)
[![CodeCov](https://codecov.io/gh/philip-bui/dagger/branch/master/graph/badge.svg)](https://codecov.io/gh/philip-bui/dagger)
[![npm](https://img.shields.io/npm/v/dagger-di.svg?style=flat)](https://www.npmjs.com/package/dagger-di)
![Downloads](https://img.shields.io/npm/dt/dagger-di.svg?style=flat)

Dagger is a dependency injection container using Decorators. 

- Tested with React Class and Functional components using Props.
- Tested with Singletons.
- Tested with Generators.
- Lazy loads dependencies until construction.

## Installation

Dagger relies on the experimental [stage-0 decorators](https://github.com/tc39/proposal-decorators). 

```bash
$ npm install dagger-di 
$ npm install @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties --save-dev
```

```bash
$ yarn add dagger-di 
$ yarn add -D @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
```

Turn on Decorators in Babel.

```javascript
{
    // React.
    "babel": {
        "presets": [
            "@babel/preset-env",
            "@babel/preset-react"
        ],
        "plugins": [
            [
                "@babel/plugin-proposal-decorators",
                {
                    "legacy": true
                }
            ],
            "@babel/plugin-proposal-class-properties"
        ]
    }
    // React-Native.
    "babel": {
        "presets": [
            "module:metro-react-native-babel-preset"
        ],
        "plugins": [
            [
                "@babel/plugin-proposal-decorators", 
                {
                    "legacy": true 
                }
            ],
            "@babel/plugin-proposal-class-properties"
        ]
    }
}
```

Turn on Decorators in ESLint.

```javascript
package.json
{
    ...,
    "eslintConfig": {
        "ecmaFeatures": {
            "experimentalDecorators": true,
            "legacyDecorators": true
        }
    }
}
```

## Usage

```javascript
import { singleton } from "dagger-di";

// Registers "Foo" with a singleton Foo.
@singleton
class Foo {

}
```

```javascript
import { inject, generator } from "dagger";

// Registers "Bar" with a Generator creating 
// a new instance for every injection of "Bar".
@generator
@inject("Foo")
class Bar {
    constructor(foo) {
        this.foo = foo;
    }
}
```

```javascript
export const warrior = () => {};

export const ninja = () => {};

export const archer = () => {};
```

```javascript
import { register, registerLazily, registerModule } from "dagger-di";
import { injectProps } from "dagger-di/src/react"
// Load the module to load the singleton decorator.
import from "./Foo"; 

// Or manually register without decorators.
register("BarTwo", require("./Bar"));

// Or register a lazy function to evaluate when it is used.
registerLazily("LazyBar", () => require("./Bar"));

// Or register all exports within a module.
registerModule(require("./module"));

// Throws an error if any dependencies haven't been registered.
// On construction, Dagger will inject the dependencies for you.
@injectProps("Foo", "Bar", "LazyBar", "warrior", "ninja")
class FooBar extends Component {

    render() {
        const { Foo, Bar, LazyBar, warrior, ninja } = this.props;
    }
}
```

## License

Dagger is available under the MIT license. [See LICENSE](https://github.com/philip-bui/dagger/blob/master/LICENSE) for details.
