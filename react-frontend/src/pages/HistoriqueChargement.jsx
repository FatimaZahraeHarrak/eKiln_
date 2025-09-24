import * as React from 'react';
import { useState, useEffect } from 'react';
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
  TablePagination,
  TextField,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Modal,
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const HistoriqueChargement = () => {
  const [chargements, setChargements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedChargement, setSelectedChargement] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    datetime_chargement: '',
    wagon: '',
    date: '',
    four: '',
    pieces: '',
    statut: '',
    datetime_sortieEstime: '', // 
    matricule: ''
  });

const handleFilterChange = (field, value) => {
  setFilters((prev) => ({ ...prev, [field]: value }));
   if ((field === 'datetime_chargement' || field === 'datetime_sortieEstime') && value) {
    setDateFrom('');
    setDateTo('');
  }
};
  const fetchHistorique = async () => {
    try {
      setLoading(true);
      setError(null);
      
      //console.log("fil ;", dateFrom);
      const token = localStorage.getItem('token');
      const params = {
            page: page + 1,
            per_page: rowsPerPage,
            search: searchTerm,
            ...(dateFrom && { date_from: dateFrom }),
            ...(dateTo && { date_to: dateTo }),
            ...(filters.wagon && { wagon: filters.wagon }),
            ...(filters.four && { four: filters.four }),
            ...(filters.pieces && { pieces: filters.pieces }),
            ...(filters.statut && { statut: filters.statut }),
             ...(filters.datetime_sortieEstime && { datetime_sortieEstime: filters.datetime_sortieEstime }), // 
               ...(filters.datetime_chargement && { datetime_chargement: filters.datetime_chargement }), // 
            ...(filters.matricule && { matricule: filters.matricule }),
        };

      const response = await axios.get('http://localhost:8000/api/chargements/historique', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      //console.log("data",response.data.data.data);
      setChargements(response.data.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Erreur:', error);
      setError("Erreur lors du chargement de l'historique");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorique();
  }, [page, rowsPerPage, searchTerm, dateFrom, dateTo , filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setPage(0);
  };

  const handleViewDetails = (chargement) => {
    setSelectedChargement(chargement);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en attente': return 'warning';
      case 'en cuisson': return 'info';
      case 'prêt à sortir': return 'success';
      case 'sorti': return 'default';
      default: return 'primary';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Historique des Chargements
      </Typography>

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher par wagon, four ou statut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />
              }}
            />
          </Grid> */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ mr: 2 }}
            >
              Filtres
            </Button> */}
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchHistorique}
            >
              Actualiser
            </Button>
          </Grid>
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Date de début"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dateFrom}
                     onChange={(e) => {
                      setDateFrom(e.target.value);
                      if (e.target.value) {
                        setFilters((prev) => ({
                          ...prev,
                          datetime_chargement: '',
                          datetime_sortieEstime: ''
                        }));
                      }
                    }}
                    InputProps={{
                      startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Date de fin"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dateTo}
                   onChange={(e) => {
                      setDateTo(e.target.value);
                      if (e.target.value) {
                        setFilters((prev) => ({
                          ...prev,
                          datetime_chargement: '',
                          datetime_sortieEstime: ''
                        }));
                      }
                    }}
                    InputProps={{
                      startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="text"
                    onClick={handleResetFilters}
                    startIcon={<CloseIcon />}
                  >
                    Réinitialiser
                  </Button>
                </Grid>
              </Grid>
            </Grid>
        </Grid>
      </Paper>
      {/* Tableau */}
      <Paper sx={{ overflow: 'hidden' }}>
          <>
            <TableContainer>
              <Table>
               <TableHead>
                    <TableRow>
                      <TableCell>
                    Date Chargement
                    <TextField
                      variant="standard"
                      type="date"
                      value={filters.datetime_chargement || ''}
                       onChange={(e) => handleFilterChange('datetime_chargement', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                  </TableCell>
                      <TableCell>
                        Wagon
                        <TextField
                          variant="standard"
                          value={filters.wagon}
                          onChange={(e) => handleFilterChange('wagon', e.target.value)}
                          placeholder="Filtrer..."
                        />
                      </TableCell>
                      <TableCell>
                        Four
                        <TextField
                          variant="standard"
                          value={filters.four}
                          onChange={(e) => handleFilterChange('four', e.target.value)}
                          placeholder="Filtrer..."
                        />
                      </TableCell>
                      <TableCell>
                        Pièces
                        <TextField
                          variant="standard"
                          value={filters.pieces}
                          onChange={(e) => handleFilterChange('pieces', e.target.value)}
                          placeholder="Filtrer..."
                        />
                      </TableCell>
                      <TableCell>
                        Statut
                        <TextField
                          variant="standard"
                          value={filters.statut}
                          onChange={(e) => handleFilterChange('statut', e.target.value)}
                          placeholder="Filtrer..."
                        />
                      </TableCell>
                      <TableCell>
                    Date sortie estimée
                    <TextField
                      variant="standard"
                      type="date"
                      value={filters.datetime_sortieEstime || ''}
                      onChange={(e) => handleFilterChange('datetime_sortieEstime', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                      <TableCell>
                        Matricule
                        <TextField
                          variant="standard"
                          value={filters.matricule}
                          onChange={(e) => handleFilterChange('matricule', e.target.value)}
                          placeholder="Filtrer..."
                        />
                      </TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : error ? (
                    <Box sx={{ p: 2, color: 'error.main' }}>{error}</Box>
                  ) : (
                <TableBody>
                  {chargements.map((chargement) => (
                    <TableRow key={chargement.id}>
                      <TableCell>{formatDate(chargement.datetime_chargement)}</TableCell>
                      <TableCell>{chargement.wagon?.num_wagon || 'N/A'}</TableCell>
                      <TableCell>{chargement.four?.num_four || 'N/A'}</TableCell>
                      <TableCell>
                        {chargement.details.reduce((sum, detail) => sum + detail.quantite, 0)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={chargement.statut} 
                          color={getStatusColor(chargement.statut)}
                          size="small"
                        />
                      </TableCell>
                       <TableCell>
                        {chargement.datetime_sortieEstime
                          ? formatDate(chargement.datetime_sortieEstime)
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {chargement.user?.matricule || "-"}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Voir détails">
                          <IconButton
                            onClick={() => handleViewDetails(chargement)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
        )}
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            />
          </>
      </Paper>

      {/* Modal de détails */}
      <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          {selectedChargement && (
            <>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Détails du chargement #{selectedChargement.id}</Typography>
                <IconButton onClick={() => setShowDetailsModal(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Wagon:</Typography>
                  <Typography>{selectedChargement.wagon?.num_wagon || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Four:</Typography>
                  <Typography>{selectedChargement.four?.num_four || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Date Chargement:</Typography>
                  <Typography>{formatDate(selectedChargement.datetime_chargement)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Statut:</Typography>
                  <Chip 
                    label={selectedChargement.statut} 
                    color={getStatusColor(selectedChargement.statut)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Enregistré par:</Typography>
                  <Typography>
                    {selectedChargement.user?.nom} {selectedChargement.user?.prenom}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total pièces:</Typography>
                  <Typography>
                    {selectedChargement.details.reduce((sum, detail) => sum + detail.quantite, 0)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Détails des pièces</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Famille</TableCell>
                      <TableCell align="right">Quantité</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedChargement.details.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.famille?.nom_famille || 'N/A'}</TableCell>
                        <TableCell align="right">{detail.quantite}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default HistoriqueChargement;