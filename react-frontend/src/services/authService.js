import api from './api'

const authService = {
  // Connexion utilisateur
// Add error logging for 500 errors
login: async (matricule, password) => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('/login', { matricule, password });
      return response.data.user;
    } catch (error) {
      console.error('Full error object:', error); // Log full error
      throw error.response?.data?.message || 'Server error';
    }
  },

  // Déconnexion utilisateur
  logout: async () => {
    try {
      await api.post('/logout')
      return true
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error)
      return false
    }
  },

  // Récupérer l'utilisateur actuellement connecté
  getCurrentUser: async () => {
    // try {
    //   const response = await api.get('/api/user')
    //   return response.data
    // } catch (error) {
    //   console.error('Error fetching current user:', error)
      return null
//     }
  }
}

export default authService;
