import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ViewModule as ViewModuleIcon,
  History as HistoryIcon,
  Assignment as AssignmentIcon,
  LocalShipping as LocalShippingIcon,
  LocalFireDepartment    as LocalFireDepartmentIcon    ,
} from '@mui/icons-material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';

//  Thème global
const appTheme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Bleu profond plus élégant
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: '#f50057', // Rose/violet pour les accents
    },
    background: {
      default: '#f8fafc', // Très léger bleu-gris
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Gris foncé pour le texte
      secondary: '#64748b', // Gris moyen
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px 0 rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: '#ffffff',
          },
          '&:nth-of-type(even)': {
            backgroundColor: '#f8fafc',
          },
          '&:hover': {
            backgroundColor: '#f1f5ff',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
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
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main Menu',
  },
  {
    segment: 'chefDashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path:'/chefDashboard'
  },
  {
      segment: 'historique',
      title: 'Historique Chargements',
      icon: <HistoryIcon />,
      path:'/historique'
  },
  {
    segment: 'WagonVisualization',
    title: 'Wagon Visualization',
    icon: <ViewModuleIcon />,
    path:'/WagonVisualization'
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
      segment: 'manage-users',
      title: 'Manage Users',
      icon: <GroupsIcon />,
      path: '/manage-users'
    },
    {
      segment: 'ChargementContent',
      title: 'Chargement Wagon',
      icon: <LocalShippingIcon />,
      path: '/ChargementContent'
    },
    {
      segment: 'affectation',
      title: 'Affectation des Trieurs',
      icon: <AssignmentIcon />,
      path:'/affectation'
   },
   {
    segment: 'history',
    title: 'History / Archives',
    icon: <HistoryIcon />,
    path: '/history'
  },
  // {
  //   segment: 'team',
  //   title: 'Team management',
  //   icon: <PeopleIcon />,
  //   path: '/team',
  //   children: [
  //     {
  //       segment: 'trieurs',
  //       title: 'Trieurs',
  //       icon: <PeopleIcon fontSize="small" />,
  //       path: '/team/trieurs',
  //     },
  //     {
  //       segment: 'enfourneur',
  //       title: 'Enfourneur',
  //       icon: <PeopleIcon fontSize="small" />,
  //       path:'/team/enfourneur'
  //     },
  //   ],
  // },
  /*{
    segment: 'familles',
      title: 'Gestion des Familles',
      icon: <ListAltIcon />,
  },
  {
  segment: 'parametrage',
    title: 'Paramétre',
    icon: <SettingsIcon />,
  },
  {
    kind: 'divider',
  },*/
  {
    segment: 'logout',
    title: 'Déconnexion',
    icon: <LogoutIcon color="error" />,
  },
];
const NAV_CHEF = [
  { kind: 'header',
   title: 'Main Menu'
  },
  { segment: 'chefDashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/chefDashboard'
  },
  { segment: 'historique',
    title: 'Historique Chargements',
    icon: <HistoryIcon />,
    path: '/historique' 
  },
  { segment: 'WagonVisualization',
    title: 'Wagon Visualization', 
    icon: <ViewModuleIcon />,
    path: '/WagonVisualization'
  },
  {
    segment: 'team',
    title: 'Team management',
    icon: <PeopleIcon />,
    path: '/team',
    children: [
      {
        segment: 'trieurs',
        title: 'Trieurs',
        icon: <PeopleIcon fontSize="small" />,
        path: '/team/trieurs',
      },
      {
        segment: 'enfourneur',
        title: 'Enfourneur',
        icon: <PeopleIcon fontSize="small" />,
        path:'/team/enfourneur'
      },
    ],
  },
  { segment: 'ChargementContent',
    title: 'Chargement Wagon',
    icon: <LocalShippingIcon />,
    path: '/ChargementContent' 
  },
  { segment: 'logout',
    title: 'Déconnexion',
    icon: <LogoutIcon color="error" /> 
  },
];
const NAV_JeuneFour = [
   { kind: 'header',
   title: 'Main Menu'
  },
   { segment: 'jeuneFour',
    title: 'Chargements Four',
    icon: <LocalFireDepartmentIcon />, 
    path: '/jeuneFour' 
  },
  { segment: 'historique',
    title: 'Historique Chargements',
    icon: <HistoryIcon />,
    path: '/historique' 
  },
  { segment: 'WagonVisualization',
    title: 'Wagon Visualization', 
    icon: <ViewModuleIcon />,
    path: '/WagonVisualization'
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
      ]
    },
  { segment: 'logout',
    title: 'Déconnexion',
    icon: <LogoutIcon color="error" /> 
  },
]
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

const SidebarChef = ({ children, window }) => {
  const router = useAppRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.navigate('/');
  };

  const demoWindow = window !== undefined ? window() : undefined;
  // 🔹 Récupération du rôle utilisateur
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role?.toLowerCase();
   if (role === "chef d'equipe" || role === 'chef') {
     console.log("C'est un chef ✅");
    return (
      <AppProvider
        navigation={NAV_CHEF}
         branding={{
          title: 'eKiln',
          homeUrl: '/ChefDashboard',
        }}
        router={router}
        theme={appTheme}
        window={demoWindow}
      >
        <CustomDashboardLayout onLogout={handleLogout}>
          {children}
        </CustomDashboardLayout>
      </AppProvider>
    );
  }
    if (role === "jeune four" || role === 'jeune') {
     console.log("C'est un jeune four ✅");
    return (
      <AppProvider
        navigation={NAV_JeuneFour}
         branding={{
          title: 'eKiln',
          homeUrl: '/jeuneFour',
        }}
        router={router}
        theme={appTheme}
        window={demoWindow}
      >
        <CustomDashboardLayout onLogout={handleLogout}>
          {children}
        </CustomDashboardLayout>
      </AppProvider>
    );
  }
  return (
    <AppProvider
      navigation={NAVIGATION}
        branding={{
          title: 'eKiln',
          homeUrl: '/Dashboard',
        }}
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

SidebarChef.propTypes = {
  children: PropTypes.node.isRequired,
  window: PropTypes.func,
};

export default SidebarChef;


