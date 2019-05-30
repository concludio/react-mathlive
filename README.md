# react-mathlive
A react wrapper-component for [mathlive.js](https://mathlive.io)'s math-editor.

## How to install

You can install *react-mathlive* like any other Javascript or Typescript library via npm:

```
npm i react-mathlive
```

As *react-mathlive* is written in Typescript, it comes with it's own typings.

## How to use

This text assumes you know [how to build simple react-components](https://reactjs.org/tutorial/tutorial.html).

You can use the `Mathfield`-component in your web-application as follows:

```JavaScript
render() {
  return <MathField
    latex="f(x)=\\log _10 x"
    onChange={this.onMathChange}
  />
}

onMathChange(mathText) {
  console.log(mathText);
}
```

## Interacting with the native library

The `Mathfield`-component also allows retrieving the native [`Mathfield`-object](http://docs.mathlive.io/MathField.html) from the Mathlive-library via the `mathFieldRef`-parameter:

```JavaScript
render() {
  return <MathField
    mathFieldRef={mf => (this.internalMathField = mf)}
  />
}
```

Via the `mathFieldOptions`-parameter it's possible to provide the native `Mathfield` with [`MathFieldOptions`](http://docs.mathlive.io/tutorial-CONFIG.html).
