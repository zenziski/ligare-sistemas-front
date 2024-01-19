import { Input } from "@chakra-ui/react";
import MaskedInput from "react-text-mask";

interface PhoneInputProps {
    value: string;
    setValue: (value: string) => void;
}

const PhoneInput = ({ value, setValue }: PhoneInputProps) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    return (
        <MaskedInput
            mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            value={value}
            onChange={onChange}
            render={(ref: any, props: any) => (
                <Input ref={ref} {...props} />
            )}
            placeholder='(99) 99999-9999'
        />
    );
}
export default PhoneInput;
