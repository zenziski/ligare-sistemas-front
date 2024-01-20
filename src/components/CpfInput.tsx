import { Input } from "@chakra-ui/react";
import MaskedInput from "react-text-mask";

interface CpfInputProps {
    value: string;
    setValue: (value: string) => void;
    formProps: any;
}

const CpfInput = ({
    value,
    setValue,
    formProps
}: CpfInputProps) => {

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <MaskedInput
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
                <Input ref={ref} {...props} {...formProps} />
            )}
            placeholder='999.999.999-99'
            value={value}
            onChange={onChange}
        />
    )
}

export default CpfInput;