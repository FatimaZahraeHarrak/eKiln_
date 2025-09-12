import { Box, Stepper, Step, StepLabel } from '@mui/material'

const WizardSteps = ({ activeStep }) => {
  const steps = [
    'Sélection',
    'Saisie wagon',
    'Récapitulatif'
  ]

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={label} completed={index < activeStep}>
              <StepLabel>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
    </Box>
  )
}

export default WizardSteps;
