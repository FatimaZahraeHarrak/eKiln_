import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import PeopleIcon from '@mui/icons-material/People';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import HistoryIcon from '@mui/icons-material/History';
import SubwayIcon from '@mui/icons-material/Subway';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ArchiveIcon from '@mui/icons-material/Archive';
import Cookies from 'js-cookie';

const appTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    segment: 'manage-users',
    title: 'Manage Users',
    icon: <PeopleIcon />,
    path: '/manage-users'
  },
  {
    segment: 'settings',
    title: 'Settings',
    icon: <SettingsApplicationsIcon />,
    path: '/settings',
    children: [
      {
        segment: 'fours',
        title: 'Fours',
        icon: <DescriptionIcon />,
        path: '/settings/fours'
      },
      {
        segment: 'wagons',
        title: 'Wagons',
        icon: <DescriptionIcon />,
        path: '/settings/wagons'
      },
      {
        segment: 'familles',
        title: 'Familles',
        icon: <DescriptionIcon />,
        path: '/settings/familles'
      },
    ],
  },
  {
    segment: 'wagon_visualization',
    title: 'Wagon Visualization',
    icon: <SubwayIcon />,
    path: '/wagon_visualization'
  },
  {
    segment: 'history',
    title: 'History / Archives',
    icon: <HistoryIcon />,
    path: '/history'
  },
   {
    segment: 'historique-chargement',
    title: 'Historique Chargement',
    icon: <HistoryIcon />,
    path: '/historique-chargement'
  },
  {
    segment: 'archives-chargements',
    title: 'Archives Chargements',
    icon: <ArchiveIcon />, 
    path: '/archives-chargements'
},

  {
    segment: 'divider',
    type: 'divider',
  },
  // Dans sidebar.jsx, modifiez la partie NAVIGATION :
{
  segment: 'logout',
  title: 'Logout',
  icon: <LogoutIcon color="error" />,
  onClick: () => {
    logout();
    navigate('/');
  }
}
];



const CustomDashboardLayout = ({ children, onLogout }) => {
  const navigate = useNavigate();

  const handleNavigation = (event, item) => {
    if (item.segment === 'logout') {
      onLogout();
    } else if (item.path) {
      navigate(item.path);
    }
    event.preventDefault();
  };

  return (
    <DashboardLayout
      slotProps={{
        sidebar: {
          PaperProps: {
            sx: {
              position: 'relative',
              paddingBottom: '64px',
            },
          },
        },
      }}
      onNav={handleNavigation}
    >
      {children}
    </DashboardLayout>
  );
};

function useAppRouter() {
  const location = useLocation();
  const navigate = useNavigate();

  return React.useMemo(() => ({
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => navigate(path),
    matches: (path) => location.pathname.startsWith(path)
  }), [location, navigate]);
}

const Sidebar = ({ children, window }) => {
  const router = useAppRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.navigate('/');
  };

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={appTheme}
      window={demoWindow}
    >
      <CustomDashboardLayout onLogout={handleLogout}>
        {React.isValidElement(children) && React.cloneElement(children, {
          pathname: router.pathname,
          navigate: router.navigate
        })}
        {!React.isValidElement(children) && children}
      </CustomDashboardLayout>
    </AppProvider>
  );
};

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  window: PropTypes.func,
};

export default Sidebar;


