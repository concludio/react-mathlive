import 'mathlive/dist/mathlive.core.css';
import 'mathlive/dist/mathlive.css';
import * as React from 'react';
import MathLive from 'mathlive/dist/mathlive.mjs';

export interface MathFieldOptions {
    ignoreSpacebarInMathMode?: boolean;
    onBlur?: (mathfield: any) => void;
    onKeystroke?: (mathfield: any, keystroke: string, ev: KeyboardEvent) => boolean;
    onContentWillChange?: (mathfield: any) => void;
    onContentDidChange?: (mathfield: any) => void;
    overrideDefaultInlineShortcuts?: boolean;
    inlineShortcuts?: { [key: string]: string };
    virtualKeyboardMode?: "manual" | "onfocus" | "off";
    virtualKeyboardToggleGlyph?: string;
    virtualKeyboards?: string;
    virtualKeyboardRomanLayout?: "querty" | "qwertz" | "azerty" | "dvorak" | "colemak";
    virtualKeyboardTheme?: "material" | "apple";
    keypressSound?: string | {
        delete?: string;
        return?: string;
        default: string;
    };
    plonkSound?: string;
    /** Incomplete */
    [ key: string ]: any;
}

export interface Props {
    latex: string;
    onChange: (latex: string) => void;

    onBlur?: () => void;
    onKeystroke?: (ev: KeyboardEvent) => void;

    /** 
     * The raw options of mathlive's makeMathField.
     * */
    mathFieldOptions?: MathFieldOptions;

    /**
     * The mathfield object returned by makeMathField.
     */
    mathFieldRef?: (mathfield: any) => void;
}

export class MathField extends React.Component<Props> {
    private insertElement: HTMLElement | null = null;
    private readonly combinedOptions: MathFieldOptions;
    private mathField: any;

    constructor(props: Props) {
        super(props);

        this.combinedOptions = {
            ...props.mathFieldOptions
        };

        if (props.mathFieldOptions && props.mathFieldOptions.onContentDidChange) {
            const fromOptions = props.mathFieldOptions.onContentDidChange;
            this.combinedOptions.onContentDidChange = mf => {
                this.props.onChange(mf.$latex());
                fromOptions(mf);
            };
        } else {
            this.combinedOptions.onContentDidChange = mf => this.props.onChange(mf.$latex());
        }

        if (this.props.onBlur) {
            const provided = this.props.onBlur;
            if (props.mathFieldOptions && props.mathFieldOptions.onBlur) {
                const fromOptions = props.mathFieldOptions.onBlur;
                this.combinedOptions.onBlur = mf => {
                    provided();
                    fromOptions(mf);
                };
            } else {
                this.combinedOptions.onBlur = provided;
            }
        }

        if (this.props.onKeystroke) {
            const provided = this.props.onKeystroke;
            if (props.mathFieldOptions && props.mathFieldOptions.onKeystroke) {
                const fromOptions = props.mathFieldOptions.onKeystroke;
                this.combinedOptions.onKeystroke = (mf, ks, ev) => {
                    provided(ev);
                    return fromOptions(mf, ks, ev);
                };
            } else {
                this.combinedOptions.onKeystroke = (mf, ks, ev) => {
                    provided(ev);
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
        
        this.mathField = MathLive.makeMathField(this.insertElement, this.combinedOptions);
        this.mathField.$latex(this.props.latex, { suppressChangeNotifications: true });

        if (this.props.mathFieldRef) {
            this.props.mathFieldRef(this.mathField);
        }
    }
}