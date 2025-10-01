import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Enfourneur from './pages/Enfourneur';
import ChefDashboard from './pages/ChefDashboard';
import Selection from './pages/Selection';
import Recap from './pages/WagonsRecap';
import Logout from './pages/Logout';
import ManageUsers from './pages/ManageUsers';
import Fours from './pages/Fours';
import Wagons from './pages/Wagons';
import Wagon_Visualization from './pages/Wagon_Visualization';
import History from './pages/History';
import ManageUsersAdd from './pages/ManageUsersAdd';
import ManageUsersEdit from './pages/ManageUsersEdit';
import WagonAdd from './pages/WagonAdd';
import WagonEdit from './pages/WagonEdit';
import { AuthProvider } from './context/AuthContext';
import Familles from './pages/Familles';
import FamilleEdit from './pages/FamilleEdit';
import FamilleAdd from './pages/FamilleAdd';
import WagonsOverview from './pages/WagonsOverview'; 

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/Enfourneur" element={<Enfourneur />} />
        <Route path="/ChefDashboard" element={<ChefDashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-users/add" element={<ManageUsersAdd />} />
        <Route path="/manage-users/edit/:id" element={<ManageUsersEdit />} />
        <Route path="/settings/fours" element={<Fours />} />
        <Route path="/settings/wagons" element={<Wagons />} />
        <Route path="/settings/wagons/add" element={<WagonAdd />} />
        <Route path="/settings/wagons/edit/:id" element={<WagonEdit />} />
        <Route path="/wagon_visualization" element={<Wagon_Visualization />} />
        <Route path="/history" element={<History />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/recap" element={<Recap />} />
         <Route path="/wagons-overview" element={<WagonsOverview />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/settings/familles" element={<Familles />} />
        <Route path="/settings/familles/add" element={<FamilleAdd />} />
        <Route path="/settings/familles/edit/:id" element={< FamilleEdit />}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;