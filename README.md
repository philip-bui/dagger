# Dagger
[![Actions Status](https://github.com/philip-bui/dagger/workflows/build/badge.svg)](https://github.com/philip-bui/dagger/actions)
[![CodeCov](https://codecov.io/gh/philip-bui/dagger/branch/master/graph/badge.svg)](https://codecov.io/gh/philip-bui/dagger)
[![npm](https://img.shields.io/npm/v/dagger-di.svg?style=flat)](https://www.npmjs.com/package/dagger-di)
![Downloads](https://img.shields.io/npm/dt/dagger-di.svg?style=flat)

Declarative dependency injection for Javascript, inspired by Java's [Dagger](https://dagger.dev/).

- **Declarative.** Dagger makes it easy to read and build complex applications. 
Annotate dependencies, compose them and Dagger handles the wiring and injections.
- **Expressive.** Few simple decorators, yet powerful. Use a minimalistic API extended by rich options chaining.
- **Interoperable.** Adopt as little or as much dependency injection as you want. 
Dagger helps improve class cohesion, loose coupling and testability.

## Installation

```bash
$ yarn add @dagger/core
```

Babel is used to compile decorators syntax and maintain compatibility with old JS environments. Add the [class](https://babeljs.io/docs/en/babel-plugin-proposal-decorators), 
[properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties) and 
[parameter](https://www.npmjs.com/package/babel-plugin-parameter-decorator) decorator plugins.

```bash
$ yarn add -D @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties babel-plugin-parameter-decorator 
```

```javascript
"plugins": [
    ["@babel/plugin-proposal-decorators", {"legacy": true}],
    ["@babel/plugin-proposal-class-properties", {"loose": true}],
    "babel-plugin-parameter-decorator"
]
```

If you're using ESLint (and you probably should!), add the [babel-eslint](https://github.com/babel/babel-eslint) 
parser to run on Babel compiled code.

```javascript
$ yarn add -D babel-eslint
```

```json
"eslintConfig": {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "legacyDecorators": true
        }
    },
}
```

## Usage

```javascript
import { Provides } from "@dagger/core";

@Provides
class FoodService {
    
    getFood = () => ["Apple"];
}
```

```javascript
import { Singleton } from "@dagger/core";

@Singleton
class HeroService {

    getHeroes = () => ["Saitama"];
}
```

<details>
<summary>Constructor Injection</summary>
<p>

```javascript
import { Inject, Named } from "@dagger/core";

@Inject
class HeroAcademcy {
    
    constructor(@Named("HeroService") heroService, water, @Named("FoodService") foodService) {
        this.heroes = heroService.getHeroes();
        this.water = water;
        this.food = foodService.getFood();
    }
}

const heroAcademy = new HeroAcademcy(undefined, ["Water"]);

console.log(heroAcademy.heroes); // ["Saitama"];
console.log(heroAcademy.water); // ["Water"];
console.log(heroAcademy.food); // ["Apple"];
```
</p>
</details>

<details>
<summary>Property Injection</summary>
<p>

```javascript
import { Inject } from "@dagger/core";
import HeroService from "./HeroService";

class HeroAcademcy {
    
    @Inject
    heroService = HeroService; // Class

    @Inject
    HeroService = null;

    @Inject.optional
    godService = null;

    @Inject.named("HeroService")
    peopleService = null;
}

const heroAcademy = new HeroAcademcy();

console.log(heroAcademy.heroService.getHeroes()); // ["Saitama"];
console.log(heroAcademy.HeroService.getHeroes()); // ["Saitama"];
console.log(heroAcademy.godService); // null;
console.log(heroAcademy.peopleService.getHeroes()); // ["Saitama"];
```
</p>
</details>

## Advanced

Decorators are exported both capitalized and lower-case for convenience.

Extend your decorators with chainable options, chaining the same option twice will use the latter option.

### @Provides

Class decorator that declares a Class as Provider, creating new instances upon every injection.

- **lazy** - Instantiate instance lazily. 
  - Default: *false*
- **named(name)** - Register dependency under `name`. 
  - Default: *Class*

### @Singleton

Class decorator that declares a Class as Singleton, creating a single instance for every injection.

- **lazy** - Instantiate instance lazily.
  - Default: *false*
- **named(name)** - Registers dependency under `name`. 
  - Default: *Class*

### @Inject

Class or property injection decorator that injects on constructor parameters, or ClassType or PropertyKey respectively.

- **computed** - Computed property. 
  - Default: *false*.
- **lazy** - Computed property until invoked once, then becomes a static value. 
  - Default: *false*.
- **optional** - Injects `undefined` if not found. 
  - Default: *false*
- **named(name)** - Injects dependency under `name`. 
  - Default: *Class*
  
> Note: Calling a constructor with provided values means Dagger won't override those values (unless `undefined`). This is by design.

### @Named(name)

Constructor parameter decorator used in conjunction with [@Inject](#@Inject).

- **optional** - Injects `undefined` if not found.

## License

Dagger is available under the MIT license. [See LICENSE](https://github.com/philip-bui/dagger/blob/master/LICENSE) for details.
