declare module 'mathlive/dist/mathlive.mjs' {
    const MathLive: {
        makeMathField: (el: HTMLElement, options?: object) => any
    };

    export default MathLive;
}