import * as React from "react";
import { makeMathField, MathfieldConfig, Mathfield } from "mathlive";

interface BaseProps {
    onChange?: (latex: string) => void;

    /**
     * The raw options of mathlive's makeMathField.
     * */
    mathfieldConfig?: MathfieldConfig;

    /**
     * The mathfield object returned by makeMathField.
     */
    mathfieldRef?: (mathfield: Mathfield) => void;
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

export function combineConfig(props: Props): MathfieldConfig {
    const combinedConfiguration: MathfieldConfig = {
        ...props.mathfieldConfig,
    };

    const { onChange } = props;

    if (onChange) {
        if (props.mathfieldConfig && props.mathfieldConfig.onContentDidChange) {
            const fromConfig = props.mathfieldConfig.onContentDidChange;
            combinedConfiguration.onContentDidChange = (mf) => {
                onChange(mf.$latex());
                fromConfig(mf);
            };
        } else {
            combinedConfiguration.onContentDidChange = (mf) =>
                onChange(mf.$latex());
        }
    }

    return combinedConfiguration;
}

/** A react-control that hosts a mathlive-mathfield in it. */
export class MathfieldComponent extends React.Component<Props> {
    private insertElement: HTMLElement | null = null;
    private readonly combinedConfiguration = combineConfig(this.props);
    private mathfield: Mathfield | undefined;

    componentDidUpdate(prevProps: Props) {
        if (!this.mathfield) {
            throw new Error("Component was not correctly initialized.");
        }
        if (prevProps.latex !== undefined) {
            if (this.props.latex === undefined) {
                throw new Error(
                    "Cannot change from controlled to uncontrolled state!"
                );
            }
            if (this.props.latex !== prevProps.latex) {
                if (this.props.latex === "") {
                    this.mathfield.$perform("deleteAll");
                } else {
                    this.mathfield.$latex(this.props.latex, {
                        suppressChangeNotifications: true,
                    });
                }
            }
        }
    }

    render() {
        return <div ref={(instance) => (this.insertElement = instance)} />;
    }

    componentDidMount() {
        if (!this.insertElement) {
            throw new Error(
                "React did apparently not mount the insert point correctly."
            );
        }

        const initialValue = this.props.initialLatex ?? this.props.latex;

        this.mathfield = makeMathField(
            this.insertElement,
            this.combinedConfiguration
        );
        this.mathfield.$latex(initialValue, {
            suppressChangeNotifications: true,
        });

        if (this.props.mathfieldRef) {
            this.props.mathfieldRef(this.mathfield);
        }
    }
}
