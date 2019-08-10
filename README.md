
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

You can use the `MathFieldComponent` in your web application as follows:

```JSX
render() {
  return <MathFieldComponent
    latex="f(x)=\\log _10 x"
    onChange={this.onMathChange}
  />;
}

onMathChange(mathText) {
  console.log(mathText);
}
```

There is also an [example Typescript react application](/examples/example1/) using this library.

### Interacting with the native library

The `MathFieldComponent` also allows retrieving the native [`MathField` object](http://docs.mathlive.io/MathField.html) from the Mathlive library via the `mathFieldRef` parameter:

```JavaScript
render() {
  return <MathFieldComponent
    mathFieldRef={mf => (this.internalMathField = mf)}
  />;
}
```

Via the optional `mathFieldConfig` parameter it is possible to provide the native `MathField` with a [`MathFieldConfig`](http://docs.mathlive.io/tutorial-CONFIG.html) on its creation:


```JSX
render() {
  return <MathFieldComponent
    mathFieldConfig={{
      defaultMode: "text"
      virtualKeyboardMode: "onfocus"
    }}
  />;
}
```

## Contribute

This is an open source library and issues and pull requests are very welcome.

See [Contributing](CONTRIBUTING.md).

