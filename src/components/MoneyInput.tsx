import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Input, } from '@chakra-ui/react';
import { Controller } from "react-hook-form";

const defaultMaskOptions = {
    prefix: 'R$ ',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 2,
    integerLimit: 9,
    allowNegative: false,
    allowLeadingZeroes: true,
};
interface MoneyInputProps {
    control: any;
    defaultValue: any;
    name: string;
}
const currencyMask = createNumberMask(defaultMaskOptions);

const MoneyInput = ({ control, defaultValue, name }: MoneyInputProps) => {

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            render={({ field }) => (
                <MaskedInput
                    {...field}
                    mask={currencyMask}
                    render={(ref: any, props: any) => (
                        <Input ref={ref} {...props} />
                    )}
                    placeholder='R$ 0,00'
                />
            )}
        />
    )
}

export default MoneyInput;



