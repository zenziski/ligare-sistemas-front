import { Input } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import MaskedInput from "react-text-mask";

interface CpfInputProps {
    control: any;
    defaultValue: any;
}

const CpfInput = ({ control, defaultValue }: CpfInputProps) => {

    return (
        <Controller
            control={control}
            name="cpf"
            defaultValue={defaultValue}
            render={({ field }) => (
                <MaskedInput
                    {...field}
                    mask={[
                        /\d/,
                        /\d/,
                        /\d/,
                        '.',
                        /\d/,
                        /\d/,
                        /\d/,
                        '.',
                        /\d/,
                        /\d/,
                        /\d/,
                        '-',
                        /\d/,
                        /\d/,
                    ]}
                    render={(ref: any, props: any) => (
                        <Input ref={ref} {...props} />
                    )}
                />
            )}
        />
    )
}

export default CpfInput;