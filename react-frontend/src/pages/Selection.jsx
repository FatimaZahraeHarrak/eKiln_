import { Container, Box } from '@mui/material'
import Sidebar from '../components/layout/sidebar.jsx';
import ParamsForm from '../components/wagon/ParamsForm'
import WizardSteps from '../components/wagon/WizardSteps'

const Selection = () => {
  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <WizardSteps activeStep={0} />
        <ParamsForm />
      </Container>
    </>
  )
}

export default Selection;
