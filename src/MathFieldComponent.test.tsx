import * as React from 'react';
import {
    render,
    fireEvent,
    cleanup,
    waitForElement,
} from '@testing-library/react';
import { MathfieldComponent, combineConfig } from './MathfieldComponent';
import { Mathfield } from 'mathlive';

afterEach(cleanup);

describe("combineConfig", () => {
    it(" combines onChange and native onContentDidChange handlers", () => {
        let value1: string | undefined, 
            value2: string | undefined;

        const combinedConfig = combineConfig({
            latex: "fubar",
            onChange: v => value1 = v,
            mathfieldConfig: {
                onContentDidChange: mf => value2 = mf.$latex(),
            },
        });

        const mockMathField = {
            $latex: () => "bar",
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
        expect(mathField.$latex()).toBe("fubar");
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
        expect(mathField.$latex()).toBe("foo");

        mathField.$latex("bar");
        expect(value).toBe("bar");
        expect(mathField.$latex()).toBe("bar");
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

        expect(mathField.$latex()).toBe("foo");

        container.setState({ value: "bar" });
        expect(mathField.$latex()).toBe("bar");

        container.setState({ value: "" });
        expect(mathField.$latex()).toBe("");
    });

    test("invalidly created instances throw correct errors", () => {
        const mathFieldComponent = new MathfieldComponent({ latex: "fubar" });

        try {
            mathFieldComponent.componentDidMount();
            fail("The previous line should have thrown.");
        } catch (e) {
            expect(e.message).toBe("React did apparently not mount the insert point correctly.");
        }
    });
});