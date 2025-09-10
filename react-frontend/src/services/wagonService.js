import api from './api'

const wagonService = {
  // Récupérer toutes les familles
  getFamilles: async () => {
    try {
      const response = await api.get('/familles')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la récupération des familles'
    }
  },

  // Récupérer tous les fours
  getFours: async () => {
    try {
      const response = await api.get('/fours')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la récupération des fours'
    }
  },

  // Récupérer tous les types de wagons
  getTypeWagons: async () => {
    try {
      const response = await api.get('/type-wagons')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la récupération des types de wagons'
    }
  },

  // Récupérer les pièces pour une famille donnée
  getPiecesByFamille: async (familleId) => {
    try {
      const response = await api.get(`/familles/${familleId}/pieces`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la récupération des pièces'
    }
  },

  // Enregistrer un nouveau wagon
  saveWagon: async (wagonData) => {
    try {
      const response = await api.post('/wagons', wagonData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de l\'enregistrement du wagon'
    }
  },

  // Récupérer les wagons pour un four et un shift donnés
  getWagons: async (fourId, shift) => {
    try {
      const response = await api.get(`/wagons?four_id=${fourId}&shift=${shift}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la récupération des wagons'
    }
  }
}

export default wagonService;
