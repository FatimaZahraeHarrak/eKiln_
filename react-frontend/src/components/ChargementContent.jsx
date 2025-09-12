import React, { useState, useEffect } from 'react';
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
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Modal,
  Divider,
  IconButton,
  Stack,
  Card,
  CardContent,
  CardActions,
  Chip,
  Fade,
  Backdrop,
  Container,
  AppBar,
  Toolbar,
  Badge,
  Tooltip,
  Skeleton
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  ListAlt as ListAltIcon,
  LocalShipping as TruckIcon,
  Factory as FactoryIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Thème moderne et professionnel
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#c51162',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 20px',
        },
        contained: {
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
  },
});

const ChargementContent = ({ setSelectedWagonDetails, setShowWagonDetailsModal }) => {
  const [familles, setFamilles] = useState([]);
  const [fours, setFours] = useState([]);
  const [wagonNum, setWagonNum] = useState("");
  const [selectedFour, setSelectedFour] = useState("");
  const [quantites, setQuantites] = useState({});
  const [loading, setLoading] = useState(false);
  const [chargements, setChargements] = useState([]);
  const [showRecap, setShowRecap] = useState(false);
  const [recapLoading, setRecapLoading] = useState(false);
  const [selectedChargement, setSelectedChargement] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Simulation des données pour la démo
  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFamilles = [
        { id_famille: 1, nom_famille: 'Pièces Mécaniques' },
        { id_famille: 2, nom_famille: 'Composants Électriques' },
        { id_famille: 3, nom_famille: 'Éléments de Carrosserie' },
        { id_famille: 4, nom_famille: 'Accessoires' },
      ];
      
      const mockFours = [
        { id_four: 1, num_four: 'Four A-1', cadence: '120 pcs/h' },
        { id_four: 2, num_four: 'Four B-2', cadence: '90 pcs/h' },
        { id_four: 3, num_four: 'Four C-3', cadence: '150 pcs/h' },
      ];

      setFamilles(mockFamilles);
      setFours(mockFours);

      const initialQuantites = {};
      mockFamilles.forEach(famille => {
        initialQuantites[famille.id_famille] = 0;
      });
      setQuantites(initialQuantites);
      setInitialLoading(false);
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

    // Simulation de la soumission
    await new Promise(resolve => setTimeout(resolve, 2000));

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

    setError({ severity: "success", message: "Chargement enregistré avec succès!" });
    resetForm();
    setLoading(false);
  };

  const resetForm = () => {
    setWagonNum("");
    setSelectedFour("");
    const resetQuantites = {};
    familles.forEach(famille => {
      resetQuantites[famille.id_famille] = 0;
    });
    setQuantites(resetQuantites);
  };

  const fetchChargements = async () => {
    setRecapLoading(true);
    
    // Simulation de chargement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockChargements = [
      {
        id: 1,
        datetime_chargement: new Date().toISOString(),
        id_wagon: 'W-001',
        four: { num_four: 'Four A-1' },
        user: { nom: 'Dupont', prenom: 'Jean' },
        statut: 'Terminé'
      },
      {
        id: 2,
        datetime_chargement: new Date(Date.now() - 3600000).toISOString(),
        id_wagon: 'W-002',
        four: { num_four: 'Four B-2' },
        user: { nom: 'Martin', prenom: 'Marie' },
        statut: 'En cours'
      },
    ];
    
    setChargements(mockChargements);
    setRecapLoading(false);
    setShowRecap(!showRecap);
  };

  const fetchChargementDetails = async (id) => {
    if (!id) return;
    
    // Simulation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockDetails = {
      id: id,
      id_wagon: `W-00${id}`,
      four: { num_four: 'Four A-1' },
      datetime_chargement: new Date().toISOString(),
      statut: 'Terminé',
      details: [
        { id_detail_chargement: 1, famille: { nom_famille: 'Pièces Mécaniques' }, quantite: 150 },
        { id_detail_chargement: 2, famille: { nom_famille: 'Composants Électriques' }, quantite: 75 },
      ]
    };
    
    setSelectedChargement(mockDetails);
    setShowDetailsModal(true);
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Terminé': return 'success';
      case 'En cours': return 'warning';
      case 'En attente': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'Terminé': return <CheckCircleIcon fontSize="small" />;
      case 'En cours': return <ScheduleIcon fontSize="small" />;
      case 'En attente': return <ErrorIcon fontSize="small" />;
      default: return null;
    }
  };

  if (initialLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
          </Box>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
              </Grid>
              <Box sx={{ mt: 4 }}>
                <Skeleton variant="rectangular" height={300} />
              </Box>
            </CardContent>
          </Card>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Header moderne */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0' }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: 'primary.main', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TruckIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" component="h1" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  Gestion des Chargements
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {showRecap ? 'Historique des opérations' : 'Nouveau chargement de wagon'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Button 
                variant={showRecap ? "outlined" : "contained"}
                startIcon={showRecap ? <AddIcon /> : <ListAltIcon />}
                onClick={fetchChargements}
                disabled={recapLoading}
                sx={{ minWidth: 180 }}
              >
                {recapLoading ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Chargement...
                  </>
                ) : (
                  showRecap ? "Nouveau Chargement" : "Voir l'Historique"
                )}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {error && (
            <Alert 
              severity={typeof error === 'object' && error.severity ? error.severity : "error"} 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError(null)}
            >
              {typeof error === 'object' && error.message ? error.message : error}
            </Alert>
          )}

          {showRecap ? (
            <Card>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AssessmentIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h5" component="h2">
                      Historique des Chargements
                    </Typography>
                    <Badge badgeContent={chargements.length} color="primary" />
                  </Box>
                </Box>

                {recapLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : chargements.length === 0 ? (
                  <Box sx={{ p: 6, textAlign: 'center' }}>
                    <TruckIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                      Aucun chargement récent
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                      Créez votre premier chargement pour commencer
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Date & Heure</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Wagon</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Four</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Opérateur</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {chargements.map((chargement, index) => (
                          <TableRow 
                            key={chargement.id}
                            sx={{ 
                              '&:hover': { bgcolor: 'grey.50' },
                              borderBottom: index === chargements.length - 1 ? 'none' : '1px solid #e2e8f0'
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {new Date(chargement.datetime_chargement).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {new Date(chargement.datetime_chargement).toLocaleTimeString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={chargement.id_wagon} 
                                variant="outlined" 
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                            <TableCell>{chargement.four?.num_four}</TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {chargement.user?.prenom} {chargement.user?.nom}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={chargement.statut}
                                color={getStatusColor(chargement.statut)}
                                size="small"
                                icon={getStatusIcon(chargement.statut)}
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Voir les détails">
                                <IconButton
                                  color="primary"
                                  onClick={() => fetchChargementDetails(chargement.id)}
                                  size="small"
                                  sx={{ 
                                    '&:hover': { 
                                      bgcolor: 'primary.light',
                                      color: 'white'
                                    }
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  {/* Section informations principales */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <FactoryIcon sx={{ color: 'primary.main' }} />
                      <Typography variant="h6" component="h3">
                        Informations du Chargement
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Numéro de Wagon"
                          variant="outlined"
                          fullWidth
                          required
                          value={wagonNum}
                          onChange={(e) => setWagonNum(e.target.value)}
                          placeholder="Ex: W-001"
                          InputProps={{
                            startAdornment: (
                              <Box sx={{ mr: 1, color: 'text.secondary' }}>
                                <TruckIcon fontSize="small" />
                              </Box>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Sélection du Four</InputLabel>
                          <Select
                            value={selectedFour}
                            label="Sélection du Four"
                            onChange={(e) => setSelectedFour(e.target.value)}
                          >
                            <MenuItem value="">
                              <em>Choisissez un four</em>
                            </MenuItem>
                            {fours.map((four) => (
                              <MenuItem key={four.id_four} value={four.id_four}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                  <FactoryIcon fontSize="small" />
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {four.num_four}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      Cadence: {four.cadence}
                                    </Typography>
                                  </Box>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider sx={{ my: 4 }} />

                  {/* Section détails du chargement */}
                  <Box>
                    <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                      Détails du Chargement
                    </Typography>
                    
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 600, py: 2 }}>
                              Famille de Pièces
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, py: 2, width: 200 }}>
                              Quantité
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {familles.map((famille, index) => (
                            <TableRow 
                              key={famille.id_famille}
                              sx={{ 
                                '&:hover': { bgcolor: 'grey.50' },
                                borderBottom: index === familles.length - 1 ? 'none' : '1px solid #e2e8f0'
                              }}
                            >
                              <TableCell sx={{ py: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                  {famille.nom_famille}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ py: 3 }}>
                                <TextField
                                  type="number"
                                  variant="outlined"
                                  size="small"
                                  InputProps={{ 
                                    inputProps: { min: 0, max: 9999 },
                                    sx: { textAlign: 'center' }
                                  }}
                                  value={quantites[famille.id_famille] || 0}
                                  onChange={(e) => handleQuantiteChange(famille.id_famille, e.target.value)}
                                  fullWidth
                                  sx={{ maxWidth: 120, mx: 'auto', display: 'block' }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Actions */}
                  <CardActions sx={{ justifyContent: 'flex-end', pt: 4, px: 0 }}>
                    <Button
                      variant="outlined"
                      onClick={resetForm}
                      disabled={loading}
                      sx={{ mr: 2 }}
                    >
                      Réinitialiser
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                      disabled={loading}
                      size="large"
                      sx={{ minWidth: 160 }}
                    >
                      {loading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </CardActions>
                </Box>
              </CardContent>
            </Card>
          )}
        </Container>

        {/* Modal détails modernisée */}
        <Modal 
          open={showDetailsModal} 
          onClose={() => setShowDetailsModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={showDetailsModal}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 700 },
              maxHeight: '90vh',
              overflow: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            }}>
              <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main', borderRadius: '12px 12px 0 0' }}>
                <Toolbar>
                  <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Détails du chargement #{selectedChargement?.id}
                  </Typography>
                  <IconButton 
                    edge="end" 
                    color="inherit" 
                    onClick={() => setShowDetailsModal(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              
              {selectedChargement && (
                <Box sx={{ p: 4 }}>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Wagon
                        </Typography>
                        <Chip 
                          label={selectedChargement.id_wagon} 
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Four
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedChargement.four?.num_four}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Date & Heure
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {new Date(selectedChargement.datetime_chargement).toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Statut
                        </Typography>
                        <Chip 
                          label={selectedChargement.statut}
                          color={getStatusColor(selectedChargement.statut)}
                          icon={getStatusIcon(selectedChargement.statut)}
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Composition du Chargement
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Famille de Pièces</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Quantité</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedChargement.details?.map((detail, index) => (
                          <TableRow 
                            key={detail.id_detail_chargement}
                            sx={{ 
                              borderBottom: index === selectedChargement.details.length - 1 ? 'none' : '1px solid #e2e8f0'
                            }}
                          >
                            <TableCell>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {detail.famille?.nom_famille || 'Inconnue'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={detail.quantite}
                                variant="outlined"
                                color="primary"
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          </Fade>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default ChargementContent;