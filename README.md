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
$ npm install dagger @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators
```

```bash
$ yarn add dagger @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators
```

Turn on Decorators in Babel.

```javascript
package.json
{
    ...
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
import { Provides } from "dagger";

// Registers Foo with Singleton Foo.
@Provides
class Foo {

}
```

```javascript
import { Inject, GeneratorNamed } from "dagger";

// Registers Bar with a Generator creating a new instance on every dependency needed.
@GeneratorNamed("Bar")
@Inject("Foo")
class Bar {
    constructor(foo) {
        this.foo = foo;
    }
}
```

```javascript
import { register, registerLazily, InjectProps } from "dagger";
import from "./Foo"; // Loading the class will automatically inject from @Provides decorator.

// Manually register an object, value etc.
register("Bar", require("./Bar"));

// Manually register a lazy function to evaluate when dependency is needed.
registerLazily("LazyBar", () => require("./Bar"));

// This will throw an error if any dependency keys haven't been registered. 
// On FooBar construction, then Dagger will initialize the dependencies.
@InjectProps("Foo", "Bar", "LazyBar")
class FooBar extends Component {

    render() {
        const { Foo, Bar, LazyBar } = this.props;
    }
}
```

## License

Dagger is available under the MIT license. [See LICENSE](https://github.com/philip-bui/dagger/blob/master/LICENSE) for details.
