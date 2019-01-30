import 'mathlive/dist/mathlive.core.css';
import 'mathlive/dist/mathlive.css';
import * as React from 'react';
import MathLive from 'mathlive/dist/mathlive.mjs';

interface Props {
    latex: string;
    onChange: (latex: string) => void;
    options?: { [key: string]: any };
    mathFieldRef?: (mf: any) => void;
}

export class MathField extends React.Component<Props> {
    insertElement: HTMLElement | null = null;

    render() {
        return <div
            ref={instance => this.insertElement = instance}
        />;
    }

    componentDidMount() {
        if (!this.insertElement) {
            throw new Error("React did apparently not mount the insert point correctly.");
        }

        let options = {
            ...this.props.options,
            onContentDidChange: (mf: any) => {
                this.props.onChange(mf.text("latex"))
            }
        };

        const mf = MathLive.makeMathField(this.insertElement, options);

        if (this.props.mathFieldRef) {
            this.props.mathFieldRef(mf);
        }
    }
}