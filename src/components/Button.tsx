import { Button } from "@chakra-ui/react";
import { ReactElement, useEffect, useState } from "react";

interface IFormButtonProps {
    type?: "button" | "submit" | "reset" | undefined;
    disabled?: Boolean;
    children: ReactElement | String;
    onClick?: any | undefined;
    width?: any;
    isLoading?: boolean;
    color?: string;
}

export const FormButton = (props: IFormButtonProps) => {

    const [isDisabled, setDisabled] = useState<boolean>((props.disabled && false) as boolean);

    useEffect(() => {
        setDisabled(props.disabled as boolean);
    }, [props.disabled]);

    return (
        <Button
            type={props.type && "button"}
            borderRadius="4px"
            bgColor={props.color || "primary"}
            isLoading={props.isLoading ? props.isLoading : false}
            color="white"
            _hover={{ bgColor: "primary-200", cursor: "pointer" }}
            border="none"
            h="32px"
            width={props.width}
            fontSize="12px"
            fontWeight={400}
            fontFamily="Poppins-Light"
            disabled={isDisabled}
            _disabled={{
                bgColor: "#D9D9D9",
                cursor: "not-allowed",
                "&:hover": {
                    cursor: "not-allowed",
                    bgColor: "#D9D9D9",
                },
            }}
            onClick={props.onClick}
        >
            {props.children}
        </Button>
    );
}