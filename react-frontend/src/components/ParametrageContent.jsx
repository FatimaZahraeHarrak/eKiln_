import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const ParametrageContent = () => {
  const [fours, setFours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingFour, setEditingFour] = useState(null);
  const [newCadence, setNewCadence] = useState('');

  const formatDuration = (seconds) => {
    if (!seconds) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchFours = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/fours', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFours(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des fours");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFours();
  }, []);

  const handleUpdateCadence = async (id_four) => {
    if (!newCadence || isNaN(newCadence)) {
      setError("Veuillez entrer une cadence valide");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/fours/${id_four}/update-cadence`,
        { new_cadence: parseFloat(newCadence) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setFours(fours.map(four => 
          four.id_four === id_four ? response.data.four : four
        ));
        setSuccess("Cadence et durée de cuisson mises à jour avec succès");
        setEditingFour(null);
        setNewCadence('');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Paramétrage des fours
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Numéro de four</TableCell>
                <TableCell>Cadence actuelle</TableCell>
                <TableCell>Durée de cuisson actuelle</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fours.map((four) => (
                <TableRow key={four.id_four}>
                  <TableCell>{four.num_four}</TableCell>
                  <TableCell>{four.cadence}</TableCell>
                  <TableCell>{formatDuration(four.duree_cuisson)}</TableCell>
                  <TableCell>
                    {editingFour === four.id_four ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          type="number"
                          label="Nouvelle cadence"
                          value={newCadence}
                          onChange={(e) => setNewCadence(e.target.value)}
                          size="small"
                          sx={{ width: 120 }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => handleUpdateCadence(four.id_four)}
                          disabled={loading}
                          size="small"
                        >
                          Valider
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setEditingFour(null)}
                          size="small"
                        >
                          Annuler
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditingFour(four.id_four);
                          setNewCadence(four.cadence);
                        }}
                      >
                        Modifier
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> Lorsque vous modifiez la cadence, la durée de cuisson est automatiquement recalculée<br />
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ParametrageContent;