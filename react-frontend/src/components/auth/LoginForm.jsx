import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert
} from '@mui/material'
// import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';

const LoginForm = () => {
  const [matricule, setMatricule] = useState('')
  const [password, setPassword] = useState('') // Changed from 'nom' to 'password'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

//   const { login } = useAuth()
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!matricule || !password) { // Changed from 'nom' to 'password'
      setError('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    setError('')

    try {
    //   await login(matricule, password)
    const response = await axios.post('http://localhost:8000/api/login1', {
        Matricule:matricule,
        Password:password,
      });

      const token = response?.data?.token ?? null;
      if(token != null)
        {
        Cookies.set('auth_token', token, { expires: 7 });
        // navigate('/dashboard');
        window.location.href="/dashboard";
        }else{
            setError('Identifiants incorrects');
        }

      // Save token to cookies
    //   Cookies.set('auth_token', token, { expires: 7 }); // Expires in 7 days

      // Use token for all future axios requests
    //   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //   navigate('/dashboard')
    } catch (err) {
      setError('Identifiants incorrectss');
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <CardContent>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            CeramicFlow
          </Typography>
          <Typography variant="h6" component="h2">
            Connexion Board
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Matricule"
            variant="outlined"
            margin="normal"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password" // Added password masking
            variant="outlined"
            margin="normal"
            value={password} // Changed from [password] to password
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default LoginForm;
