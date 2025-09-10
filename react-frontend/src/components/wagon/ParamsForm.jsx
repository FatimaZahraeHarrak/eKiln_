import { useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material'
import { useWagon } from '../../context/WagonContext'
import { useNavigate } from 'react-router-dom'

/**
 * ParamsForm component for selecting ceramic family and oven parameters
 */
const ParamsForm = () => {
  const {
    selectedFamille,
    selectedFour,
    famillesList,
    foursList,
    loadLists,
    setParams,
    loading,
    error
  } = useWagon()

  const navigate = useNavigate()

  // Load families and ovens lists on component mount
  useEffect(() => {
    loadLists()
  }, [loadLists])

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/wagon-entry')
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Sélection des paramètres
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="famille-label">Famille de céramique</InputLabel>
                  <Select
                    labelId="famille-label"
                    id="famille"
                    value={selectedFamille}
                    label="Famille de céramique"
                    onChange={(e) => setParams(e.target.value, selectedFour)}
                    required
                  >
                    <MenuItem value="">Sélectionnez une famille</MenuItem>
                    {famillesList.map((famille) => (
                      <MenuItem key={famille.id} value={famille.id}>
                        {famille.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="four-label">Numéro de four</InputLabel>
                  <Select
                    labelId="four-label"
                    id="four"
                    value={selectedFour}
                    label="Numéro de four"
                    onChange={(e) => setParams(selectedFamille, e.target.value)}
                    required
                  >
                    <MenuItem value="">Sélectionnez un four</MenuItem>
                    {foursList.map((four) => (
                      <MenuItem key={four.id} value={four.id}>
                        Four {four.numero}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!selectedFamille || !selectedFour}
              >
                Continuer
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ParamsForm;
