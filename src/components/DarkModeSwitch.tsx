import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useColorMode, Switch, Flex } from '@chakra-ui/react'

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <Flex justify="center" align="center">
      {isDark ? <SunIcon /> : <MoonIcon />}
      <Switch
        pl="4"
        title="Toggle theme"
        colorScheme="green"
        isChecked={isDark}
        onChange={toggleColorMode}
      />
    </Flex>
  )
}
