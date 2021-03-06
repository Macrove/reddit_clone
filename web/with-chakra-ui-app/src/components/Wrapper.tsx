import { Box } from '@chakra-ui/layout';
import React from 'react'

interface WrapperProps {
    variant?: "small" | "regular"
}

export const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
    return <Box maxW={variant === "regular" ? "800px" : "400px"} mx="auto" w="100%" mt={8} >{children}</Box>;
}