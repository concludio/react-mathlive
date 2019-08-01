import 'mathlive/dist/mathlive.core.css';
import 'mathlive/dist/mathlive.css';
import * as React from 'react';
import { makeMathField } from 'mathlive';

export interface Props {
    latex: string;
    onChange?: (latex: string) => void;
    onBlur?: () => void;
    onKeystroke?: (ev: KeyboardEvent) => void;

    /** 
     * The raw options of mathlive's makeMathField.
     * */
    mathFieldOptions?: MathFieldConfig;

    /**
     * The mathfield object returned by makeMathField.
     */
    mathFieldRef?: (mathfield: MathField) => void;
}

/** A react-control that hosts a mathlive-mathfield in it. */
export class MathFieldComponent extends React.Component<Props> {
    private insertElement: HTMLElement | null = null;
    private readonly combinedOptions: MathFieldConfig;
    private mathField: MathField;

    constructor(props: Props) {
        super(props);

        this.combinedOptions = {
            ...props.mathFieldOptions
        };

        const { onChange, onBlur, onKeystroke } = this.props;

        if (onChange) {
            if (props.mathFieldOptions && props.mathFieldOptions.onContentDidChange) {
                const fromOptions = props.mathFieldOptions.onContentDidChange;
                this.combinedOptions.onContentDidChange = mf => {
                    onChange(mf.$latex());
                    fromOptions(mf);
                };
            } else {
                this.combinedOptions.onContentDidChange = mf => onChange(mf.$latex());
            }
        }

        if (onBlur) {
            if (props.mathFieldOptions && props.mathFieldOptions.onBlur) {
                const fromOptions = props.mathFieldOptions.onBlur;
                this.combinedOptions.onBlur = mf => {
                    onBlur();
                    fromOptions(mf);
                };
            } else {
                this.combinedOptions.onBlur = onBlur;
            }
        }

        if (onKeystroke) {
            if (props.mathFieldOptions && props.mathFieldOptions.onKeystroke) {
                const fromOptions = props.mathFieldOptions.onKeystroke;
                this.combinedOptions.onKeystroke = (mf, ks, ev) => {
                    onKeystroke(ev);
                    return fromOptions(mf, ks, ev);
                };
            } else {
                this.combinedOptions.onKeystroke = (mf, ks, ev) => {
                    onKeystroke(ev);
                    return true;
                }
            }
        }
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.latex !== this.props.latex) {
            this.mathField.$latex(newProps.latex, { suppressChangeNotifications: true });
        }
    }

    /** The domain of react ends here, so it should not render again. */
    shouldComponentUpdate() { return false; }

    render() {
        return <div ref={instance => this.insertElement = instance} />;
    }

    componentDidMount() {
        if (!this.insertElement) {
            throw new Error("React did apparently not mount the insert point correctly.");
        }
        
        this.mathField = makeMathField(this.insertElement, this.combinedOptions);
        this.mathField.$latex(this.props.latex, { suppressChangeNotifications: true });

        if (this.props.mathFieldRef) {
            this.props.mathFieldRef(this.mathField);
        }
    }
}