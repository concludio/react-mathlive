import * as React from "react";
import {Mathfield, MathfieldConfig, MathfieldElement} from "mathlive";
import "mathlive/dist/mathlive-fonts.css";
import {MathfieldOptions} from "mathlive/dist/public/options";
import {useEffect, useRef, useState} from "react";

interface BaseProps {
    onChange?: (latex: string) => void;

    /**
     * The raw options of mathlive's makeMathField.
     * */
    mathfieldConfig?: Partial<MathfieldConfig>;

    /**
     * The mathfield object returned by makeMathField.
     */
    mathfieldRef?: (mathfieldElement: MathfieldElement) => void;
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

export function combineConfig(props: Props): Partial<MathfieldConfig> {
    const combinedConfiguration: Partial<MathfieldConfig> = {
        ...props.mathfieldConfig,
    };

    const {onChange} = props;

    if (onChange) {
        if (props.mathfieldConfig && props.mathfieldConfig.onContentDidChange) {
            const fromConfig = props.mathfieldConfig.onContentDidChange;
            combinedConfiguration.onContentDidChange = (mf: Mathfield) => {
                onChange(mf.getValue());
                fromConfig(mf);
            };
        } else {
            combinedConfiguration.onContentDidChange = (mf: Mathfield) =>
                onChange(mf.getValue());
        }
    }

    return combinedConfiguration;
}

export const MathfieldComponent = (props: Props): JSX.Element => {
    const insertElement = useRef<HTMLDivElement | null>(null)
    const [combinedConfiguration] = useState(combineConfig(props))
    const [mathfield] = useState<MathfieldElement>(new MathfieldElement(combinedConfiguration))

    // Run on initial component render
    useEffect(() => {
        if (!insertElement) return
        insertElement.current!.replaceWith(mathfield)
        const initialValue = props.initialLatex ?? props.latex
        mathfield.setValue(initialValue, {
            suppressChangeNotifications: true,
        })
        if (props.mathfieldRef) {
            props.mathfieldRef(mathfield)
        }

    }, [insertElement])

    useEffect(() => {
        if (!mathfield) {
            throw new Error("Component was not correctly initialized.");
        }

        if (props.latex === undefined) {
            throw new Error(
                "Cannot change from controlled to uncontrolled state!"
            );
        }

        mathfield.setValue(props.latex, {
            suppressChangeNotifications: true,
        });

    }, [props.latex])

    return <div ref={insertElement}/>
}
