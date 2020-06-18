
# react-mathlive
[![Build Status](https://semaphoreci.com/api/v1/concludio/react-mathlive/branches/master/shields_badge.svg)](https://semaphoreci.com/concludio/react-mathlive)
[![Coverage Status](https://coveralls.io/repos/github/concludio/react-mathlive/badge.svg?branch=master)](https://coveralls.io/github/concludio/react-mathlive?branch=master)

A react component using [mathlive.js](https://mathlive.io)'s mathfield (interactive math editor).

## How to install

You can install *react-mathlive* like any other Javascript or Typescript library via npm:

```
npm i react-mathlive
```

For Typescript users: As *react-mathlive* is written in Typescript, it comes with its own typings.

## How to use

This text assumes you know [how to build simple react components](https://reactjs.org/tutorial/tutorial.html).

You can use the `MathfieldComponent` in your web application as follows:

```JS
import { MathfieldComponent } from "react-mathlive";
```

You can then either use it as a controlled or uncontrolled component.

### Uncontrolled component

In this mode the mathfield is initialized with the `initialLatex`. Whenever the user performs changes the `onChange`-handler is called.

This example is part of an assumed react component class.

```JSX
render() {
  return <MathfieldComponent
    initialLatex="f(x)=\\log _10 x"
    onChange={this.onMathChange}
  />;
}

onMathChange(mathText) {
  console.log(mathText);
}
```

In an uncontrolled `MathfieldComponent` the only way to programmatically change the mathfields contents are by accessing the `mathfield` directly and calling the modifying methods in there (see [Interacting with the native library](#Interacting-with-the-native-library)).

### Controlled component

In this mode the mathfield gets its contents updated whenever the `latex`-property changes.

This example makes use of reacts functional components.

```JSX
export function MyComponent() {
  const [latex, setLatex] = React.useState("f(x)=\\log _10 x");
  return <MathfieldComponent
    latex={latex}
    onChange={setLatex}
  />;
}
```

There is also an [example Typescript react application](/examples/example1/) using this library.

### Interacting with the native library

The `MathfieldComponent` also allows retrieving the native [`Mathfield` object](https://cortexjs.io/docs/mathlive/#(%22mathfield%22%3Amodule).(Mathfield%3Ainterface)) from the Mathlive library via the `mathfieldRef` parameter:

```JavaScript
render() {
  return <MathfieldComponent
    mathfieldRef={mf => (this.internalMathfield = mf)}
  />;
}
```

The object stored in `internalMathfield` can be used to read and modify the underlying mathfield directly.

Via the optional `mathfieldConfig` parameter it is possible to provide the native `Mathfield` with a [`MathfieldConfig`](https://cortexjs.io/docs/mathlive/#(%22config%22%3Amodule).(MathfieldConfig%3Atype)) on its creation:


```JSX
render() {
  return <MathfieldComponent
    mathfieldConfig={{
      defaultMode: "text"
      virtualKeyboardMode: "onfocus"
    }}
  />;
}
```

## Contribute

This is an open source library and issues and pull requests are very welcome.

See [Contributing](CONTRIBUTING.md).

