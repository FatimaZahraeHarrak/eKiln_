import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Divider
} from '@mui/material'
import { useWagon } from '../../context/WagonContext'
import { useNavigate } from 'react-router-dom'
import wagonService from '../../services/wagonService'

const WagonForm = () => {
  const {
    selectedFamille,
    typeWagonsList,
    setShift,
    addWagon
  } = useWagon()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [pieces, setPieces] = useState([])
  const [formData, setFormData] = useState({
    shift: '',
    numWagon: '',
    typeWagon: '',
    pieces: {}
  })

  useEffect(() => {
    const loadPieces = async () => {
      if (selectedFamille) {
        setLoading(true)
        try {
          const piecesData = await wagonService.getPiecesByFamille(selectedFamille)
          setPieces(piecesData)

          // Initialiser l'objet des pièces avec des valeurs à 0
          const initialPieces = {}
          piecesData.forEach(piece => {
            initialPieces[piece.id] = 0
          })

          setFormData(prev => ({
            ...prev,
            pieces: initialPieces
          }))
        } catch (error) {
          console.error('Erreur lors du chargement des pièces', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadPieces()
  }, [selectedFamille])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePieceChange = (pieceId, value) => {
    setFormData(prev => ({
      ...prev,
      pieces: {
        ...prev.pieces,
        [pieceId]: parseInt(value) || 0
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Calculer le total des pièces
    const totalPieces = Object.values(formData.pieces).reduce((sum, val) => sum + val, 0)

    // Trouver le type de wagon sélectionné
    const selectedTypeWagon = typeWagonsList.find(type => type.id === formData.typeWagon)

    // Préparer les détails des pièces pour l'affichage
    const pieceDetails = pieces
      .filter(piece => formData.pieces[piece.id] > 0)
      .map(piece => `${piece.nom} (${formData.pieces[piece.id]})`)
      .join(', ')

    // Créer l'objet wagon à ajouter
    const wagonToAdd = {
      numeroWagon: formData.numWagon,
      typeWagon: selectedTypeWagon ? selectedTypeWagon.nom : '',
      totalPieces,
      details: pieceDetails,
      shift: formData.shift,
      pieces: formData.pieces
    }

    // Enregistrer le shift dans le contexte
    setShift(formData.shift)

    // Ajouter le wagon et naviguer vers la page de récapitulatif
    addWagon(wagonToAdd)
    navigate('/recap')
  }

  const handleBack = () => {
    navigate('/selection')
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Saisie des données du wagon
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="shift-label">Shift</InputLabel>
          <Select
            labelId="shift-label"
            name="shift"
            value={formData.shift}
            label="Shift"
            onChange={handleInputChange}
            required
          >
            <MenuItem value="">Sélectionnez un shift</MenuItem>
            <MenuItem value="1">Shift 1</MenuItem>
            <MenuItem value="2">Shift 2</MenuItem>
            <MenuItem value="3">Shift 3</MenuItem>
          </Select>
        </FormControl>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro du wagon"
                name="numWagon"
                type="number"
                value={formData.numWagon}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="type-wagon-label">Type de wagon</InputLabel>
                <Select
                  labelId="type-wagon-label"
                  name="typeWagon"
                  value={formData.typeWagon}
                  label="Type de wagon"
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="">Sélectionnez un type</MenuItem>
                  {typeWagonsList.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {loading ? (
            <Typography sx={{ my: 3 }}>Chargement des pièces...</Typography>
          ) : (
            <>
              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Pièces {pieces.length > 0 && `de la famille sélectionnée`}
              </Typography>

              <Grid container spacing={2}>
                {pieces.map((piece) => (
                  <Grid item xs={12} sm={6} md={4} key={piece.id}>
                    <TextField
                      fullWidth
                      label={piece.nom}
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={formData.pieces[piece.id] || 0}
                      onChange={(e) => handlePieceChange(piece.id, e.target.value)}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleBack}
            >
              Retour
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formData.shift || !formData.numWagon || !formData.typeWagon}
            >
              Valider
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WagonForm
