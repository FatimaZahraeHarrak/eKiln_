import { createContext, useContext, useState, useReducer } from 'react'

const WagonContext = createContext()

export const useWagon = () => useContext(WagonContext)

const initialState = {
  selectedFamille: '',
  selectedFour: '',
  selectedShift: '',
  wagonData: null,
  wagons: []
}

const wagonReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PARAMS':
      return {
        ...state,
        selectedFamille: action.payload.famille,
        selectedFour: action.payload.four
      }
    case 'SET_SHIFT':
      return {
        ...state,
        selectedShift: action.payload
      }
    case 'SET_WAGON_DATA':
      return {
        ...state,
        wagonData: action.payload
      }
    case 'ADD_WAGON':
      return {
        ...state,
        wagons: [...state.wagons, action.payload],
        wagonData: null
      }
    case 'RESET_FORM':
      return {
        ...state,
        wagonData: null
      }
    case 'RESET_ALL':
      return initialState
    default:
      return state
  }
}

export const WagonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wagonReducer, initialState)
  const [famillesList, setFamillesList] = useState([])
  const [foursList, setFoursList] = useState([])
  const [typeWagonsList, setTypeWagonsList] = useState([])

  // Fonction pour charger les listes depuis l'API
  const loadLists = async () => {
    try {
      // Dans une application réelle, ces données viendraient de l'API
      setFamillesList([
        { id: 1, nom: 'Bidet' },
        { id: 2, nom: 'Cuisine' },
        { id: 3, nom: 'Décoratif' }
      ])

      setFoursList([
        { id: 1, numero: '3' },
        { id: 2, numero: '4' }
      ])

      setTypeWagonsList([
        { id: 1, code: 'BG', nom: 'BG' },
        { id: 2, code: 'DP', nom: 'DP' },
        { id: 3, code: 'GF', nom: 'GF' },
        { id: 4, code: 'BV', nom: 'BV' }
      ])
    } catch (error) {
      console.error('Erreur lors du chargement des listes', error)
    }
  }

  const setParams = (famille, four) => {
    dispatch({
      type: 'SET_PARAMS',
      payload: { famille, four }
    })
  }

  const setShift = (shift) => {
    dispatch({
      type: 'SET_SHIFT',
      payload: shift
    })
  }

  const setWagonData = (data) => {
    dispatch({
      type: 'SET_WAGON_DATA',
      payload: data
    })
  }

  const addWagon = (wagon) => {
    // Ajouter l'heure d'entrée et l'heure de sortie estimée
    const now = new Date()
    const entryTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    // Estimation de l'heure de sortie (exemple: +18 heures)
    const estimatedExit = new Date(now.getTime() + 18 * 60 * 60 * 1000)
    const exitDate = estimatedExit.getDate().toString().padStart(2, '0') + '/' +
                    (estimatedExit.getMonth() + 1).toString().padStart(2, '0')
    const exitTime = `${estimatedExit.getHours().toString().padStart(2, '0')}:${estimatedExit.getMinutes().toString().padStart(2, '0')} (${exitDate})`

    const completeWagon = {
      ...wagon,
      entryTime,
      exitTime
    }

    dispatch({
      type: 'ADD_WAGON',
      payload: completeWagon
    })
  }

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' })
  }

  const resetAll = () => {
    dispatch({ type: 'RESET_ALL' })
  }

  const value = {
    ...state,
    famillesList,
    foursList,
    typeWagonsList,
    loadLists,
    setParams,
    setShift,
    setWagonData,
    addWagon,
    resetForm,
    resetAll
  }

  return <WagonContext.Provider value={value}>{children}</WagonContext.Provider>
}
