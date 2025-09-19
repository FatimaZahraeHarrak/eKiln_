import { useState, useEffect, useRef } from "react";
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
  const [totalPieces, setTotalPieces] = useState(0); // Nouvel état pour le total des pièces
  const [chargementCount, setChargementCount] = useState(0); // Nouvel état pour le nombre de chargements
  const wagonRef = useRef(null);
  const messageRef = useRef(null);
 //const [_isEditing, setIsEditing] = useState({});


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
//localStorage.setItem("user", JSON.stringify(user));
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
            setTimeout(() => {
                  messageRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 50);
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
    // Mettre à jour les chargements et compteur
     fetchChargements(false);
    // Afficher le message
    setError({ severity: "success", message: "Chargement enregistré avec succès!" });
    // Scroll vers le message après rendu
    setTimeout(() => {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    // Mettre le focus sur le champ Wagon
    wagonRef.current?.focus();
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
        // Scroll vers le message
  setTimeout(() => {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    } finally {
        setLoading(false);
         wagonRef.current?.focus(); // remettre le focus sur le champ Wagon
    }
};

  const resetForm = () => {
    //setWagonNum("");
    setSelectedWagon("");
    //setSelectedFour("");
    const resetQuantites = {};
    familles.forEach(famille => {
      resetQuantites[famille.id_famille] = 0;
    });
    setQuantites(resetQuantites);
  };

  const fetchChargements = async (toggleRecap = false) => {
  setRecapLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:8000/api/chargements/mes-chargements",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const chargements = response.data;

    const totalPieces = chargements.reduce((sum, chargement) => {
      return sum + (chargement.details
        ? chargement.details.reduce((detSum, detail) => detSum + detail.quantite, 0)
        : 0);
    }, 0);

    const chargementCount = chargements.length;

    setChargements(chargements);
    setTotalPieces(totalPieces);
    setChargementCount(chargementCount);

    // toggle l'affichage seulement si demandé
    if (toggleRecap) {
      setShowRecap(!showRecap);
    }

  } catch (error) {
    console.error("Erreur lors du chargement des chargements:", error);
    setError("Impossible de charger les chargements");
  } finally {
    setRecapLoading(false);
  }
};
useEffect(() => {
    fetchChargements(); 
  }, []);

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
const fourRef = useRef(null);
const [fourOpen, setFourOpen] = useState(false);

// Ref pour savoir si le menu a déjà été ouvert une fois
const hasOpenedFourOnce = useRef(false);

// Quand le wagon change → focus + ouvrir le menu **une seule fois**
useEffect(() => {
  if (selectedWagon && fourRef.current && !hasOpenedFourOnce.current) {
    fourRef.current.focus();       // focus visible
    setFourOpen(true);             // ouvre le menu
    hasOpenedFourOnce.current = true; // on ne le refait plus
  }
}, [selectedWagon]);
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
          ref={messageRef}
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
                {/* Wagon Autocomplete */}
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
                         inputRef={wagonRef} // <- ici la vraie ref sur l'input moi 
                      />
                    )}
                    sx={{ '& .MuiAutocomplete-input': { width: '240px' } }}
                  />
                </Grid>

                {/* Four Select */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel id="four-select-label">Four</InputLabel>
                    <Select
                      labelId="four-select-label"
                      id="four-select"
                      value={selectedFour}
                      label="Four"
                      inputRef={fourRef}
                      open={fourOpen}
                      onOpen={() => setFourOpen(true)}
                      onClose={() => setFourOpen(false)}
                      onChange={(e) => {
                        setSelectedFour(e.target.value);
                        setFourOpen(false); // referme après sélection
                      }}
                      sx={{ '& .MuiSelect-select': { width: '140px' } }}
                    >
                      {/* <MenuItem value="">
                        <em>Sélectionnez un four</em>
                      </MenuItem> */}
                      {fours?.map((four) => (
                        <MenuItem key={four.id_four} value={four.id_four}>
                          {four.num_four} - Cadence: {four.cadence}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Paper Fields */}
                <Grid container spacing={3} justifyContent="flex-end" minWidth={"50%"}>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        Title 1
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Nom
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {totalPieces}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Pièces
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {chargementCount}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                      Chargements
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              <Typography variant="h6" component="h3" sx={{ mt: 4, mb: 2 }}>
                Détails du chargement
              </Typography>
              
               <TableContainer component={Paper} variant="outlined">
             
                <Table aria-label="details table" size="small">
                  <TableBody>
                    {(() => {
                      // 1 Trier les familles alphabétiquement
                      const famillesTriees = [...familles].sort((a, b) =>
                        a.nom_famille.localeCompare(b.nom_famille)
                      );

                      // 2 Découper en deux colonnes
                      const mid = Math.ceil(famillesTriees.length / 2);
                      const col1 = famillesTriees.slice(0, mid);
                      const col2 = famillesTriees.slice(mid);

                      // 3 Construire les lignes
                      return col1.map((famille1, rowIndex) => {
                        const famille2 = col2[rowIndex];
                        return (
                          <TableRow key={rowIndex}>
                            {/* Colonne 1 */}
                            <TableCell>{famille1.nom_famille}</TableCell>
                            <TableCell>
                            <TextField
                              type="text"
                              variant="outlined"
                              size="small"
                              value={quantites[famille1.id_famille] === 0 ? "0" : quantites[famille1.id_famille]}
                              // onFocus={() => {
                              //     if ((quantites[famille1.id_famille] || 0) === 0) {
                              //       setQuantites(prev => ({ ...prev, [famille1.id_famille]: "" }));
                              //       setIsEditing(prev => ({ ...prev, [famille1.id_famille]: true }));
                              //     }
                              //   }}
                              onChange={(e) => {
                                // filtrer pour garder uniquement les chiffres
                                const val = e.target.value.replace(/[^0-9]/g, "");
                                handleQuantiteChange(famille1.id_famille, val === "" ? 0 : Number(val));
                              }}
                              onBlur={(e) => {
                                if (e.target.value === "") handleQuantiteChange(famille1.id_famille, 0);
                              }}
                              fullWidth
                            />
                            </TableCell>
                            {/* Colonne 2 (si existe) */}
                            {famille2 ? (
                              <>
                                <TableCell>{famille2.nom_famille}</TableCell>
                                <TableCell>
                                  <TextField
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={quantites[famille2.id_famille] === 0 ? "0" : quantites[famille2.id_famille]}
                                    InputProps={{ inputProps: { pattern: "[0-9]*", inputMode: "numeric" } }}
                                    /*onFocus={() => {
                                      if ((quantites[famille1.id_famille] || 0) === 0) {
                                        setQuantites(prev => ({ ...prev, [famille2.id_famille]: "" }));
                                        setIsEditing(prev => ({ ...prev, [famille2.id_famille]: true }));
                                      }
                                    }}*/
                                    onChange={(e) => {
                                      // filtrer pour garder uniquement les chiffres
                                      const val = e.target.value.replace(/[^0-9]/g, "");
                                      handleQuantiteChange(famille2.id_famille, val === "" ? 0 : Number(val));
                                    }}
                                    onBlur={(e) => {
                                      if (e.target.value === "") handleQuantiteChange(famille2.id_famille, 0);
                                    }}
                                    fullWidth
                                  />
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                              </>
                            )}
                          </TableRow>
                        );
                      });
                    })()}
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