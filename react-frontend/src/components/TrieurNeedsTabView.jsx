import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// TabPanel component to handle tab content display
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Single TrieursNeededCard component
const TrieursNeededCard = ({ data }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>Total pièces à trier:</strong> {data.total_pieces}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>Trieurs nécessaires:</strong> {data.total_trieurs_needed}
      </Typography>
      
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Famille</TableCell>
              <TableCell align="right">Pièces</TableCell>
              <TableCell align="right">Trieurs nécessaires</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.familles.map((famille, index) => (
              <TableRow key={index}>
                <TableCell>{famille.nom_famille}</TableCell>
                <TableCell align="right">{famille.total_pieces}</TableCell>
                <TableCell align="right">{famille.trieurs_needed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

// Main component with tabs
const TrieurNeedsTabView = ({ trieursNeeded }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Calculate combined data for "All" tab
  const getAllData = () => {
    if (!trieursNeeded.f3 || !trieursNeeded.f4) return null;
    
    const combinedFamilles = {};
    let totalPieces = 0;
    let totalTrieursNeeded = 0;
    
    // Process F3 data
    trieursNeeded.f3.familles.forEach(famille => {
      combinedFamilles[famille.nom_famille] = {
        nom_famille: famille.nom_famille,
        total_pieces: famille.total_pieces,
        trieurs_needed: famille.trieurs_needed
      };
      totalPieces += famille.total_pieces;
      totalTrieursNeeded += famille.trieurs_needed;
    });
    
    // Process F4 data and merge with existing
    trieursNeeded.f4.familles.forEach(famille => {
      if (combinedFamilles[famille.nom_famille]) {
        combinedFamilles[famille.nom_famille].total_pieces += famille.total_pieces;
        combinedFamilles[famille.nom_famille].trieurs_needed += famille.trieurs_needed;
      } else {
        combinedFamilles[famille.nom_famille] = {
          nom_famille: famille.nom_famille,
          total_pieces: famille.total_pieces,
          trieurs_needed: famille.trieurs_needed
        };
      }
      totalPieces += famille.total_pieces;
      totalTrieursNeeded += famille.trieurs_needed;
    });
    
    return {
      total_pieces: totalPieces,
      total_trieurs_needed: totalTrieursNeeded,
      familles: Object.values(combinedFamilles)
    };
  };

  const allData = getAllData();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="besoins en trieurs tabs"
          variant="fullWidth"
        >
          <Tab label="Tous les fours" />
          <Tab label="Four F3" />
          <Tab label="Four F4" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        {allData ? (
          <>
            <Typography variant="h6" gutterBottom>
              Besoins en Trieurs - Tous les Fours
            </Typography>
            <TrieursNeededCard data={allData} />
          </>
        ) : (
          <Typography>Données non disponibles</Typography>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Besoins en Trieurs - Four F3
        </Typography>
        {trieursNeeded.f3 ? (
          <TrieursNeededCard data={trieursNeeded.f3} />
        ) : (
          <Typography>Données non disponibles pour F3</Typography>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Besoins en Trieurs - Four F4
        </Typography>
        {trieursNeeded.f4 ? (
          <TrieursNeededCard data={trieursNeeded.f4} />
        ) : (
          <Typography>Données non disponibles pour F4</Typography>
        )}
      </TabPanel>
    </Box>
  );
};

export default TrieurNeedsTabView;