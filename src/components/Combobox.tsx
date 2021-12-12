import React, { LegacyRef, RefObject, useEffect, useState } from 'react';
import { useCombobox } from "downshift";
import { Input, List, ListItem, Flex, IconButton, ListItemProps, ComponentWithAs, ListProps, InputProps } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';

//const items = ["Seattle", "San Francisco", "Springfield", "New York", "Boston"];
export interface ComboboxItem {
    label: string;
    value: string;
}
const ComboboxInput = React.forwardRef<HTMLInputElement, InputProps & { value?: ComboboxItem }>(
    (props, ref) => {
        return (<Input {...props} ref={ref} />)
    }
);

const ComboboxList = React.forwardRef<HTMLUListElement, {
    isOpen: boolean;
} & ListProps>(
    ({ isOpen, ...props }, ref) => <List display={isOpen ? null : "none"} py={2} {...props} ref={ref} />
);

const ComboboxItem = React.forwardRef<HTMLLIElement, {
    itemIndex: number;
    highlightedIndex: number;
} & ListItemProps>(
    ({ itemIndex, highlightedIndex, ...props }, ref) => {
        const isActive = itemIndex === highlightedIndex;

        return (
            <ListItem
                transition="background-color 220ms, color 220ms"
                bg={isActive ? "green.300" : null}
                px={4}
                py={2}
                cursor="pointer"
                {...props}
                ref={ref}
            />
        );
    }
);

interface ComboboxProps {
    items: string[];
    selectedItem?: string;
    setSelectedItem: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// TODO : fix so that the selectedItem.label is rendered but still allows user to change it
export const Combobox = ({ items, selectedItem, setSelectedItem }: ComboboxProps) => {
    const [inputItems, setInputItems] = useState([...items]);
    const [item, setItem] = useState(selectedItem);

    useEffect(() => {
        setSelectedItem(item);
    }, [item])
    const {
        isOpen,
        getToggleButtonProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps
    } = useCombobox({
        items: inputItems,
        selectedItem: item,
        onSelectedItemChange: ({ inputValue }) => {
            setItem(inputValue)
        },
        onInputValueChange: ({ inputValue: input }) => {
            setInputItems(items.filter((item) =>
                item.toLowerCase().includes(input.toLowerCase())
            ))
        }

    });

    return (
        <Flex {...getComboboxProps()}>
            <Flex direction="row" alignItems="center">
                <ComboboxInput
                    {...getInputProps()}
                    placeholder="Search..."
                />
                <IconButton
                    {...getToggleButtonProps()}
                    aria-label={"toggle menu"}
                    variantColor={isOpen ? "gray" : "teal"}
                    icon={isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                />
            </Flex>
            <ComboboxList
                isOpen={isOpen}
                {...getMenuProps()}
                maxH="180px"
                overflowY="auto"
                margin="0"
                borderTop="0"
                position="absolute"
                zIndex={1000}
                p="3"
                minW="200px"
                top="90px"
                color="black"
                bgColor="white"
            >
                {inputItems.map((item, index) => (
                    <ComboboxItem
                        {...getItemProps({ item, index })}
                        itemIndex={index}
                        highlightedIndex={highlightedIndex}
                        key={index}
                    >
                        {item}
                    </ComboboxItem>
                ))}
            </ComboboxList>
        </Flex>

    );
}
