import 'mathlive/dist/mathlive.core.css';
import 'mathlive/dist/mathlive.css';
import * as React from 'react';
import { makeMathField } from 'mathlive';

export interface Props {
    latex: string;
    onChange?: (latex: string) => void;

    /** 
     * The raw options of mathlive's makeMathField.
     * */
    mathFieldConfig?: MathFieldConfig;

    /**
     * The mathfield object returned by makeMathField.
     */
    mathFieldRef?: (mathfield: MathField) => void;
}

export function combineConfig(props: Props): MathFieldConfig {
    const combinedConfiguration: MathFieldConfig = {
        ...props.mathFieldConfig
    };

    const { onChange } = props;

    if (onChange) {
        if (props.mathFieldConfig && props.mathFieldConfig.onContentDidChange) {
            const fromConfig = props.mathFieldConfig.onContentDidChange;
            combinedConfiguration.onContentDidChange = mf => {
                onChange(mf.$latex());
                fromConfig(mf);
            };
        } else {
            combinedConfiguration.onContentDidChange = mf => onChange(mf.$latex());
        }
    }

    return combinedConfiguration;
}

/** A react-control that hosts a mathlive-mathfield in it. */
export class MathFieldComponent extends React.Component<Props> {
    private insertElement: HTMLElement | null = null;
    private readonly combinedConfiguration = combineConfig(this.props);
    private mathField: MathField | undefined;

    componentWillReceiveProps(newProps: Props) {
        if (!this.mathField) {
            throw new Error("Component was not correctly initialized.");
        }

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
        
        this.mathField = makeMathField(this.insertElement, this.combinedConfiguration);
        this.mathField.$latex(this.props.latex, { suppressChangeNotifications: true });

        if (this.props.mathFieldRef) {
            this.props.mathFieldRef(this.mathField);
        }
    }
}