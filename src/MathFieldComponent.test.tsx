import * as React from 'react';
import {
    render,
    fireEvent,
    cleanup,
    waitForElement,
} from '@testing-library/react';
import { MathFieldComponent } from './MathFieldComponent';

afterEach(cleanup);

describe("MathFieldComponent", () => {
    it(" mounts mathfield", () => {
        const mountingResult = render(
            <MathFieldComponent
                latex="fubar" 
            />
        );
        const mlTextAreas = mountingResult.baseElement.getElementsByClassName("ML__textarea");
        expect(mlTextAreas).toHaveLength(1);
    });

    it(" internal mathfield yields correct latex", () => {
        let mathField: any;
        const mountingResult = render(
            <MathFieldComponent
                mathFieldRef={mf => mathField = mf}
                latex="fubar" 
            />
        );
        expect(mathField.$latex()).toBe("fubar");
    });

    it(" onChange reacts to direct mathfield interaction", () => {
        let value = "foo";
        let mathField: any;
        render(
            <MathFieldComponent
                mathFieldRef={mf => mathField = mf}
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

    it(" accept changed props", () => {
        class Container extends React.Component<{}, { value: string }> {
            public state = { value: "foo" };
            public mathField: any;

            public render() {
                return <MathFieldComponent 
                    mathFieldRef={mf => this.mathField = mf}
                    latex={this.state.value}
                />;
            }
        }

        let container!: Container;
        render(<Container ref={c => container = c!} />);
        let mathField = container.mathField;

        expect(mathField.$latex()).toBe("foo");

        container.setState({ value: "bar" });
        container.forceUpdate();
        expect(mathField.$latex()).toBe("bar");
    });
});