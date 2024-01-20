import { Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from "@chakra-ui/react";
import React from "react";

interface IStat {
    label: string;
    value: number | string;
    hasArrow?: boolean;
    arrowType?: 'increase' | 'decrease';
    helpText: string;
}

const StatComponent: React.FC<IStat> = ({ label, value, arrowType, hasArrow, helpText }) => {
    return (
        <Box minW="300px" width={'100%'}  h="150px">
            <Stat bg="blackAlpha.50" p={4} borderRadius="15px" w="100%" h="100%">
                <StatLabel fontSize="24px">{label}</StatLabel>
                <StatNumber>{value}</StatNumber>
                <StatHelpText fontSize="18px">
                    {hasArrow && <StatArrow type={arrowType} />}
                    {helpText}
                </StatHelpText>
            </Stat>
        </Box>
    )
}

export default StatComponent;