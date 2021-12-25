import { Container } from '../components/Container'
import { Navbar } from '../components/Navbar'
import { FlightSearch } from '../features/FlightSearch/FlightSearch'

const Index = () => {
  return (<Container minH="100vh" overflowX="hidden">
    <Navbar />
    <Container flex="1" justifyContent="center">
      <FlightSearch />
    </Container>
  </Container>
  )
}

export default Index
