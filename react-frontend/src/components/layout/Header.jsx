// import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
// // import { useAuth } from '../../context/AuthContext'
// import { useNavigate } from 'react-router-dom'
// import Cookies from 'js-cookie';

// const Header = () => {
// //   const { user, logout } = useAuth()
// const token = Cookies.get('auth_token');
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     // await logout()
//     Cookies.remove('auth_token');
//     window.location.href="/login";
//     // navigate('/login')
//   }

//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           CeramicFlow
//         </Typography>
//         {token && (
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {/* <Typography variant="body1" sx={{ mr: 2 }}>
//               {user.nom} ({user.matricule})
//             </Typography> */}
//             <Button color="inherit" onClick={handleLogout}>
//               Déconnexion
//             </Button>
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   )
// }

// export default Header;




