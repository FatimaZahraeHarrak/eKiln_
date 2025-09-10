import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  AppBar,
  Toolbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Divider,
  Alert,
  Autocomplete
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SaveIcon from "@mui/icons-material/Save";
import ListAltIcon from "@mui/icons-material/ListAlt";

function Enfourneur() {
  const [familles, setFamilles] = useState([]);
  const [fours, setFours] = useState([]);
  const [wagons, setWAgons] = useState([]);
  //const [wagonNum, setWagonNum] = useState("");
  const [selectedFour, setSelectedFour] = useState("");
  const [selectedWagon, setSelectedWagon] = useState("");
  const [quantites, setQuantites] = useState({});
  const [loading, setLoading] = useState(false);
  const [chargements, setChargements] = useState([]);
  const [showRecap, setShowRecap] = useState(false);
  const [recapLoading, setRecapLoading] = useState(false);
  const [selectedChargement, setSelectedChargement] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [famillesRes, foursRes, wagonsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/familles", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/fours", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/wagons1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFamilles(famillesRes.data);
        setFours(foursRes.data);
        setWAgons(wagonsRes.data.data);

        const initialQuantites = {};
        famillesRes.data.forEach(famille => {
          initialQuantites[famille.id_famille] = 0;
        });
        setQuantites(initialQuantites);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Erreur lors du chargement des données initiales");
      }
    };
    fetchInitialData();
  }, []);

  const handleQuantiteChange = (id_famille, value) => {
    setQuantites({
      ...quantites,
      [id_famille]: parseInt(value) || 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem("token");
        const userResponse = await axios.get("http://localhost:8000/api/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const user = userResponse.data;

        const pieces = [];
        for (const id_famille in quantites) {
            if (quantites[id_famille] > 0) {
                pieces.push({
                    id_famille: parseInt(id_famille),
                    quantite: parseInt(quantites[id_famille])
                });
            }
        }

        if (pieces.length === 0) {
            setError("Veuillez saisir au moins une quantité");
            setLoading(false);
            return;
        }

        const chargementData = {
            id_user: user.id_user,
            //id_wagon: parseInt(wagonNum),
            id_four: parseInt(selectedFour),
            id_wagon: parseInt(selectedWagon),
            pieces: pieces
        };

        await axios.post("http://localhost:8000/api/chargements", chargementData, {
            headers: { Authorization: `Bearer ${token}`, 'Accept': 'application/json' },
        });

        setError({ severity: "success", message: "Chargement enregistré avec succès!" });
        resetForm();
    } catch (error) {
        console.error("Erreur complète:", error);
        if (error.response) {
            const { data } = error.response;
            if (data.statut_wagon) {
                setError(`Ce wagon n'est pas disponible (statut: ${data.statut_wagon})`);
            } else if (data.errors) {
                const messages = Object.values(data.errors).flat().join('\n');
                setError(`Erreur(s) de validation:\n${messages}`);
            } else {
                setError(`Erreur: ${data.message || "Erreur inconnue"}`);
            }
        } else {
            setError("Erreur réseau ou inconnue");
        }
    } finally {
        setLoading(false);
    }
};

  const resetForm = () => {
    //setWagonNum("");
    setSelectedWagon("");
    setSelectedFour("");
    const resetQuantites = {};
    familles.forEach(famille => {
      resetQuantites[famille.id_famille] = 0;
    });
    setQuantites(resetQuantites);
  };

  const fetchChargements = async () => {
    setRecapLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/chargements/mes-chargements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChargements(response.data);
      setShowRecap(!showRecap);
    } catch (error) {
      console.error("Erreur lors du chargement des chargements:", error);
      setError("Impossible de charger les chargements");
    } finally {
      setRecapLoading(false);
    }
  };

  const fetchChargementDetails = async (id) => {
    if (!id) {
      console.error("ID de chargement non fourni");
      setError("Erreur: ID de chargement manquant");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/chargements/${id}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedChargement(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error);
      if (error.response) {
        console.error("Réponse d'erreur:", error.response.data);
        setError(`Erreur: ${error.response.data.message || "Erreur serveur"}`);
      } else {
        setError("Erreur réseau ou inconnue");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Système de Gestion des Fours
          </Typography>
          <Button 
            color="inherit"
            startIcon={<ListAltIcon />}
            onClick={fetchChargements}
            disabled={recapLoading}
          >
            {recapLoading ? "Chargement..." : showRecap ? "Masquer" : "Mes Chargements"}
          </Button>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert 
            severity={typeof error === 'object' && error.severity ? error.severity : "error"} 
            sx={{ mb: 2 }}
            onClose={() => setError(null)}
          >
            {typeof error === 'object' && error.message ? error.message : error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {showRecap ? "Mes Chargements" : "Nouveau Chargement de Wagon"}
          </Typography>

          {showRecap ? (
            <>
              {recapLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : chargements.length === 0 ? (
                <Alert severity="info">Aucun chargement enregistré</Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table aria-label="chargements table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Wagon</TableCell>
                        <TableCell>Four</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {chargements.map((chargement) => (
                        <TableRow key={chargement.id}>
                          <TableCell>{new Date(chargement.datetime_chargement).toLocaleString()}</TableCell>
                          <TableCell>{chargement.wagon?.num_wagon}</TableCell>
                          <TableCell>{chargement.four?.num_four}</TableCell>
                          <TableCell>{chargement.statut}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                if (chargement.id) {
                                  fetchChargementDetails(chargement.id);
                                } else {
                                  console.error("ID de chargement non défini", chargement);
                                  setError("Erreur: ID de chargement manquant");
                                }
                              }}
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                
                <Grid item xs={12} md={6} width="240px">
                  <Autocomplete
                    options={wagons}
                    getOptionLabel={(wagon) => `${wagon.num_wagon} - Statut: ${wagon.statut}`}
                    value={wagons.find(w => w.id_wagon === selectedWagon) || null}
                    onChange={(event, newValue) => {
                      setSelectedWagon(newValue ? newValue.id_wagon : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Wagon"
                        required
                        margin="normal"
                      />
                    )}
                    sx={{ '& .MuiAutocomplete-input': { width: '240px' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel id="four-select-label">Four</InputLabel>
                    <Select
                      labelId="four-select-label"
                      id="four-select"
                      value={selectedFour}
                      label="Four"
                      onChange={(e) => setSelectedFour(e.target.value)}
                      sx={{ '& .MuiSelect-select': { width: '140px' } }}
                    >
                      <MenuItem value="">
                        <em>Sélectionnez un four</em>
                      </MenuItem>
                      {fours.map((four) => (
                        <MenuItem key={four.id_four} value={four.id_four}>
                          {four.num_four} - Cadence: {four.cadence}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography variant="h6" component="h3" sx={{ mt: 4, mb: 2 }}>
                Détails du chargement
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table aria-label="details table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Famille</TableCell>
                      <TableCell width={150} align="center">Quantité</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {familles.map((famille) => (
                      <TableRow key={famille.id_famille}>
                        <TableCell>{famille.nom_famille}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            variant="outlined"
                            size="small"
                            InputProps={{ inputProps: { min: 0 } }}
                            value={quantites[famille.id_famille] || 0}
                            onChange={(e) => handleQuantiteChange(famille.id_famille, e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Modal pour les détails */}
      <Dialog 
        open={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              Détails du chargement #{selectedChargement?.id}
            </Typography>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={() => setShowDetailsModal(false)} 
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedChargement && (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Wagon:</Typography>
                  <Typography variant="body1">{selectedChargement.id_wagon}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Four:</Typography>
                  <Typography variant="body1">{selectedChargement.four?.num_four}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Date:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedChargement.datetime_chargement).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Statut:</Typography>
                  <Typography variant="body1">{selectedChargement.statut}</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Pièces chargées
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table aria-label="pieces table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Famille</TableCell>
                      <TableCell align="center">Quantité</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedChargement.details?.map((detail) => (
                      <TableRow key={detail.id_detail_chargement}>
                        <TableCell>{detail.famille?.nom_famille || 'Inconnue'}</TableCell>
                        <TableCell align="center">{detail.quantite}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDetailsModal(false)}
            color="primary"
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Enfourneur;