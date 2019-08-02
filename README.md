
# react-mathlive

[![Build Status](https://semaphoreci.com/api/v1/concludio/react-mathlive/branches/master/badge.svg)](https://semaphoreci.com/concludio/react-mathlive)

[![Coverage Status](https://coveralls.io/repos/github/concludio/react-mathlive/badge.svg?branch=master)](https://coveralls.io/github/concludio/react-mathlive?branch=master)

A react-component for using [mathlive.js](https://mathlive.io)'s mathfield (interactive math editor).

## How to install

You can install *react-mathlive* like any other Javascript or Typescript library via npm:

```
npm i react-mathlive
```

For Typescript users: As *react-mathlive* is written in Typescript, it comes with it's own typings.

## How to use

This text assumes you know [how to build simple react-components](https://reactjs.org/tutorial/tutorial.html).

You can use the `MathfieldComponent` in your web-application as follows:

```JSX
render() {
  return <MathFieldComponent
    latex="f(x)=\\log _10 x"
    onChange={this.onMathChange}
  />
}

onMathChange(mathText) {
  console.log(mathText);
}
```

There is an [example](/examples/example1/) using Typescript available.

## Interacting with the native library

The `MathfieldComponent` also allows retrieving the native [`Mathfield`-object](http://docs.mathlive.io/MathField.html) from the Mathlive-library via the `mathFieldRef`-parameter:

```JavaScript
render() {
  return <MathFieldComponent
    mathFieldRef={mf => (this.internalMathField = mf)}
  />
}
```

Via the `mathFieldOptions`-parameter it's possible to provide the native `Mathfield` with [`MathFieldOptions`](http://docs.mathlive.io/tutorial-CONFIG.html).
