import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
  } from '@mui/material'
  import { useWagon } from '../../context/WagonContext'
  import { useNavigate } from 'react-router-dom'

  const RecapTable = () => {
    const {
      selectedFamille,
      selectedFour,
      selectedShift,
      wagons,
      famillesList,
      foursList,
      resetForm,
      resetAll
    } = useWagon()

    const navigate = useNavigate()

    // Trouver les noms des éléments sélectionnés
    const selectedFamilleNom = famillesList.find(f => f.id === selectedFamille)?.nom || ''
    const selectedFourNumero = foursList.find(f => f.id === selectedFour)?.numero || ''

    const handleNewWagon = () => {
      resetForm()
      navigate('/wagon-entry')
    }

    const handleDashboard = () => {
      resetAll()
      navigate('/dashboard')
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Récapitulatif des wagons
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Chip label={`Famille: ${selectedFamilleNom}`} variant="outlined" />
            <Chip label={`Four: ${selectedFourNumero}`} variant="outlined" />
            <Chip label={`Shift: ${selectedShift}`} variant="outlined" />
          </Box>

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Numéro Wagon</TableCell>
                  <TableCell>Type Wagon</TableCell>
                  <TableCell>Total Pièces</TableCell>
                  <TableCell>Détails</TableCell>
                  <TableCell>Heure Entrée</TableCell>
                  <TableCell>Sortie Estimée</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wagons.length > 0 ? (
                  wagons.map((wagon, index) => (
                    <TableRow key={index}>
                      <TableCell>{wagon.numeroWagon}</TableCell>
                      <TableCell>{wagon.typeWagon}</TableCell>
                      <TableCell>{wagon.totalPieces}</TableCell>
                      <TableCell>{wagon.details}</TableCell>
                      <TableCell>{wagon.entryTime}</TableCell>
                      <TableCell>{wagon.exitTime}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Aucun wagon enregistré
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNewWagon}
            >
              Nouveau Wagon
            </Button>

            <Button
              variant="outlined"
              onClick={handleDashboard}
            >
              Tableau de Bord
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
  }

  export default RecapTable;
