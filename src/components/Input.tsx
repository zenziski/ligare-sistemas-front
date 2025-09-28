import React, { forwardRef } from "react";
import { Flex, InputProps, Text } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";

interface AppInputProps {
  errors?: { message?: string };
  label?: string;
  mask?: string;
}

export const AppInput = forwardRef(
  ({ errors, label, ...otherProps }: AppInputProps & InputProps, ref) => {
    return (
      <Flex direction="column" flexGrow={1}>
        <Flex position="relative">
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            variant="flushed"
            borderColor={errors ? "red" : "gray"}
            color="#3a3a3a"
            p="0"
            pl="16px"
            h="42px"
            fontSize="12px"
            borderRadius="4px"
            _placeholder={{ opacity: 0.7 }}
            bg="#e7e7e7"
            fontFamily="Poppins-Medium"
            border="none"
            {...otherProps}
          />
        </Flex>
        {errors && (
          <Text color="red" fontSize={"12px"}>
            {errors.message}
          </Text>
        )}
      </Flex>
    );
  }
);
