import 'mathlive/dist/mathlive.core.css';
import 'mathlive/dist/mathlive.css';
import * as React from 'react';
import { makeMathField } from 'mathlive';

interface BaseProps {
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

interface ControlledProps extends BaseProps {
    latex: string;
    initialLatex?: undefined;
}

interface UncontrolledProps extends BaseProps {
    latex?: undefined;
    initialLatex: string;
}

export type Props = ControlledProps | UncontrolledProps;

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

    componentDidUpdate(prevProps: Props) {
        if (!this.mathField) {
            throw new Error("Component was not correctly initialized.");
        }

        if (prevProps.latex !== undefined) {
            if (this.props.latex === undefined) {
                throw new Error("Cannot change from controlled to uncontrolled state!");
            }
            if (this.props.latex !== prevProps.latex) {
                this.mathField.$latex(this.props.latex, { suppressChangeNotifications: true });
            }
        }
    }

    render() {
        return <div ref={instance => this.insertElement = instance} />;
    }

    componentDidMount() {
        if (!this.insertElement) {
            throw new Error("React did apparently not mount the insert point correctly.");
        }

        const initialValue = this.props.initialLatex ?? this.props.latex;
        
        this.mathField = makeMathField(this.insertElement, this.combinedConfiguration);
        this.mathField.$latex(initialValue, { suppressChangeNotifications: true });

        if (this.props.mathFieldRef) {
            this.props.mathFieldRef(this.mathField);
        }
    }
}