import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Input, } from '@chakra-ui/react';

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
    allowLeadingZeroes: false,
};

const currencyMask = createNumberMask(defaultMaskOptions);

interface MoneyInputProps {
    value: string;
    setValue: (value: string) => void;
}

const MoneyInput = ({ value, setValue }: MoneyInputProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue(value.replace('R$ ', ''))
    };
    return (
        <MaskedInput
            mask={currencyMask}
            value={value}
            onChange={handleChange}
            render={(ref: any, props: any) => (
                <Input ref={ref} {...props} />
            )}
            placeholder='R$ 0,00'
        />
    )
}

export default MoneyInput;