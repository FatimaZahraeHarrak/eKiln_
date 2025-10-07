import React from 'react';
import { Box, Typography } from '@mui/material';
import { faker } from '@faker-js/faker';
// Generate fake data for demonstration
const generateWagonData = (count) => {
  const statuses = ['en cours', 'prêt à sortir', 'sorti', 'annulé'];
  const wagonTypes = ['db', 'gf', 'bv', 'bg', 'dp'];
  const fours = ['F1', 'F2', 'F3', 'F4'];

  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    wagon: {
      num_wagon: faker.string.alphanumeric(5).toUpperCase(),
      type_wagon: faker.helpers.arrayElement(wagonTypes),
    },
    four: {
      num_four: faker.helpers.arrayElement(fours),
    },
    details: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      quantite: faker.number.int({ min: 10, max: 100 }),
    })),
    datetime_sortieEstime: faker.date.future().toISOString(),
    statut: faker.helpers.arrayElement(statuses),
  }));
};

export default function WagonsOverview() {
  const [wagonsData, _setWagonsData] = React.useState(() => generateWagonData(10));
  const [filters, setFilters] = React.useState({});
  const [selectedWagon, setSelectedWagon] = React.useState(null);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchWagonDetails = (id) => {
    setSelectedWagon(id);
    // In a real app, you would fetch details here
    console.log('Fetching details for wagon:', id);
  };

  // Apply filters to the data
  const filteredWagons = React.useMemo(() => {
    let currentWagons = wagonsData;
    if (filters.type_wagon) {
      currentWagons = currentWagons.filter(
        (wagon) => wagon.wagon?.type_wagon === filters.type_wagon
      );
    }
    return currentWagons;
  }, [wagonsData, filters]);

  const customTrieursNeeded = {
    f3: { trieurs: 5, time: '2h' },
    f4: { trieurs: 3, time: '1h' },
  };
  const id_four = 6; // Example value
  const fourNum = 'F3'; // Example value

  return (
    <Box sx={{ p: 3 }}>
      <WagonTable
        wagonsData={filteredWagons}
        filters={filters}
        handleFilterChange={handleFilterChange}
        selectedWagon={selectedWagon}
        fetchWagonDetails={fetchWagonDetails}
        customTrieursNeeded={customTrieursNeeded}
        id_four={id_four}
        fourNum={fourNum}
      />
    </Box>
  );
}