import * as React from 'react';
import Sidebar from '../components/layout/sidebar';
import HistoriqueChargement from './HistoriqueChargement';


const HistoriqueAdmin = () => {

  return (
      <Sidebar>
    <HistoriqueChargement />
    </Sidebar>
  );
};

export default HistoriqueAdmin;