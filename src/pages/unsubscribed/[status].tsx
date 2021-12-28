import { useRouter } from 'next/router'
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'

import { Container } from '../../components/Container'
import { Navbar } from '../../components/Navbar'

const Unsubscribed = () => {
    const router = useRouter()
    const { status } = router.query;

    function renderUnsubscribedStatus() {
        if (status === 'success')
            return <Alert
                status='success'
                variant='subtle'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                height='200px'
            >
                <AlertIcon boxSize='40px' mr={0} />
                <AlertTitle mt={4} mb={1} fontSize='lg'>
                    Unsubscribed!
                </AlertTitle>
                <AlertDescription maxWidth='sm'>
                    You have been successfully unsubscribed from your flight tracking.
                </AlertDescription>
            </Alert>

        return <Alert
            status='error'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            height='200px'
        >
            <AlertIcon boxSize='40px' mr={0} />
            <AlertTitle mt={4} mb={1} fontSize='lg'>
                Something went wrong
            </AlertTitle>
            <AlertDescription maxWidth='sm'>
                We were not able to unsubscribe you from this flight. Please try again later.
            </AlertDescription>
        </Alert>
    }
    return (<Container minH="100vh" overflowX="hidden">
        <Navbar />
        <Container flex="1" justifyContent="center">
            {renderUnsubscribedStatus()}
        </Container>
    </Container>
    )
}

export default Unsubscribed
