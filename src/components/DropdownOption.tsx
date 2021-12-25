import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface DropdownOptionProps {
    name: string;
    sublabel: string;
}

export const DropdownOption: React.FC<DropdownOptionProps> = ({ name, sublabel }) => {
    return (
        <Flex flexDir="column">
            <Text>{name}</Text>
            <Text fontSize="sm">{sublabel}</Text>
        </Flex>
    );
}