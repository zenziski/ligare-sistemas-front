import { Input } from "@chakra-ui/react";
import MaskedInput from "react-text-mask";

interface CpfInputProps {
    value: string;
    setValue: (value: string) => void;
}

const CpfInput = ({
    value,
    setValue
}: CpfInputProps) => {

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
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
                <Input ref={ref} {...props} />
            )}
            placeholder='999.999.999-99'
            value={value}
            onChange={onChange}
        />
    )
}

export default CpfInput;