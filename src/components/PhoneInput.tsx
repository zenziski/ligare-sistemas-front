import { Input } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import MaskedInput from "react-text-mask";

interface PhoneInputProps {
    control: any;
    defaultValue: any;
}

const PhoneInput = ({ control, defaultValue }: PhoneInputProps) => {
    return (
        <Controller
            control={control}
            name="phoneNumber"
            defaultValue={defaultValue}
            render={({ field }) => (
                <MaskedInput
                    {...field}
                    mask={[
                        '(',
                        /\d/,
                        /\d/,
                        ')',
                        ' ',
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        '-',
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                    ]}
                    render={(ref: any, props: any) => (
                        <Input ref={ref} {...props} />
                    )}
                />
            )}
        />
    );
}
export default PhoneInput;
