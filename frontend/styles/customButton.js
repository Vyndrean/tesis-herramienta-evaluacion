import { Button } from "@chakra-ui/react";

const CustomButton = ({ children, ...rest }) => {
    return (
        <Button
            borderRadius="17"
            h="8"
            {...rest}
        >
            {children}
        </Button>
    );
};

export default CustomButton;
