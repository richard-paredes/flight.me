import React, { useEffect, useState } from 'react';
import { useCombobox } from "downshift";
import { Input, List, ListItem, Flex, IconButton, ListItemProps, ListProps, InputProps } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';

export interface ComboboxItem {
    label: string;
    value: string;
}
const ComboboxInput = React.forwardRef<HTMLInputElement, InputProps & { value?: ComboboxItem }>(
    (props, ref) => (<Input {...props} ref={ref} />)

);

const ComboboxList = React.forwardRef<HTMLUListElement, {
    isOpen: boolean;
} & ListProps>(
    ({ isOpen, ...props }, ref) => <List display={isOpen ? null : "none"} py={2} {...props} ref={ref} />
);

const ComboboxItem = React.forwardRef<HTMLLIElement, {
    isActive: boolean;
} & ListItemProps>(
    ({ isActive, ...props }, ref) =>
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

interface ComboboxProps<T> {
    items: T[];
    selectedItem?: T;
    labelBy: (item: T) => React.ReactNode;
    filterBy: (items: T[], input: string) => T[];
    itemToString: (item: T) => string;
    setSelectedItem: React.Dispatch<React.SetStateAction<T>>;
}

export const Combobox = <T extends unknown>({ items, selectedItem, labelBy, filterBy, itemToString, setSelectedItem }: ComboboxProps<T>) => {
    const [inputItems, setInputItems] = useState([]);
    const [item, setItem] = useState(selectedItem);

    useEffect(() => {
        setInputItems(items);
    }, [items]);
    useEffect(() => {
        setSelectedItem(item);
    }, [item]);

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
        onSelectedItemChange: ({ selectedItem }) => {
            setItem(selectedItem)
        },
        onInputValueChange: (values) => {
            setInputItems(filterBy(items, values.inputValue))
        },
        itemToString: itemToString
    });

    return (
        <Flex {...getComboboxProps()} position="relative">
            <Flex direction="row" alignItems="center" w="full">
                <ComboboxInput
                    {...getInputProps()}
                    placeholder="Search..."
                />
                <IconButton
                    {...getToggleButtonProps()}
                    aria-label={"toggle menu"}
                    colorScheme="green"
                    icon={isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                />
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
                    borderRadius="md"
                    top="45px"
                    w="full"
                    color="black"
                    bgColor="white"
                >
                    {inputItems.map((item, index) => (
                        <ComboboxItem
                            {...getItemProps({ item, index })}
                            isActive={index === highlightedIndex}
                            key={index}
                        >
                            {labelBy(item)}
                        </ComboboxItem>
                    ))}
                </ComboboxList>
            </Flex>
        </Flex>

    );
}
