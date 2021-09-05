import * as React from 'react';
import {cleanup, render,} from '@testing-library/react';
import {combineConfig, MathfieldComponent} from './MathfieldComponent';
import {Mathfield} from "mathlive";

afterEach(cleanup);

describe("combineConfig", () => {
    it(" combines onChange and native onContentDidChange handlers", () => {
        let value1: string | undefined, 
            value2: string | undefined;

        const combinedConfig = combineConfig({
            latex: "fubar",
            onChange: v => value1 = v,
            mathfieldConfig: {
                onContentDidChange: (mf: Mathfield) => value2 = mf.getValue(),
            },
        });

        const mockMathField = {
            getValue: () => "bar",
        } as Mathfield;

        combinedConfig.onContentDidChange!(mockMathField);

        expect(value1).toBe("bar");
        expect(value2).toBe("bar");
    });
});

describe("MathFieldComponent", () => {
    it(" mounts mathfield", () => {
        const mountingResult = render(
            <MathfieldComponent
                latex="fubar" 
            />
        );
        const mlTextAreas = mountingResult.baseElement.getElementsByClassName("ML__textarea");
        expect(mlTextAreas).toHaveLength(1);
    });

    it(" internal mathfield yields correct latex", () => {
        let mathField: any;
        render(
            <MathfieldComponent
                mathfieldRef={mf => mathField = mf}
                latex="fubar" 
            />
        );
        expect(mathField.getValue()).toBe("fubar");
    });

    it(" reacts to direct mathfield interaction", () => {
        let value = "foo";
        let mathField: any;
        render(
            <MathfieldComponent
                mathfieldRef={mf => mathField = mf}
                onChange={v => value = v}
                latex={value} 
            />
        );
        expect(value).toBe("foo");
        expect(mathField.getValue()).toBe("foo");

        mathField.setValue("bar");
        expect(value).toBe("bar");
        expect(mathField.getValue()).toBe("bar");
    });
    
    it(" accepts changed props", () => {
        class Container extends React.Component<{}, { value: string }> {
            public state = { value: "foo" };
            public mathField: any;

            public render() {
                return <MathfieldComponent
                    mathfieldRef={mf => this.mathField = mf}
                    latex={this.state.value}

                />;
            }
        }

        let container!: Container;
        render(<Container ref={c => container = c!} />);
        let mathField = container.mathField;

        expect(mathField.getValue()).toBe("foo");

        container.setState({ value: "bar" });
        expect(mathField.getValue()).toBe("bar");

        container.setState({ value: "" });
        expect(mathField.getValue()).toBe("");
    });
});