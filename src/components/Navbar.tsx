import { Text } from '@chakra-ui/react'
import { Container } from './Container'
import { DarkModeSwitch } from './DarkModeSwitch'

export const Navbar = (props) => {
    return <Container as="nav" w="100vw" position="sticky" top="0" flexDir="row" background="transparent" justifyContent="space-between" alignItems="flex-start" p="5" _before={{
        content: `''`,
        position: 'absolute',
        top: 0,
        left: 0,
        filter: 'blur(2px)',
        width: '100%',
        height: '100%'
    }}>
        <Text fontFamily="mono" fontSize="">Flight.me</Text>
        <DarkModeSwitch />
    </Container>
}