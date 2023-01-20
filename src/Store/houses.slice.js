/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { urls } from '../constants'

// No estas utilizando paginación, sino load more.
// En el thunk descargas todo, pero eso es un problema de rendimiento.
// La idea de paginación/cargar más es evitar descargar todo y solo descargar lo que se necesita.
function getPagedHouses(state, currentPage) {
  if (currentPage === 1) {
    return state.allIds.slice(0, 9).map((houseId) => state.byId[houseId])
  }

  const nextHouses = state.allIds
    .slice(currentPage * 9 - 9, currentPage * 8)
    .map((houseId) => state.byId[houseId])
  if (nextHouses.length < 9) {
    state.hideShowMore = true
  }
  return nextHouses
}

// Gestionar el load more aquí.
// Gestiona el error con try catch como indica la documentación de redux toolkit
export const getHouses = createAsyncThunk('houses/getHouses', async () => {
  const res = await fetch(urls.houses)
  const data = await res.json()
  return data
})
export const housesSlice = createSlice({
  name: 'houses',
  // Declarar el inital state fuera del slice.
  initialState: {
    reqStatus: 'initial', // expandir con isSuccess, isError, isLoading, hasMore, etc para que sea más fácil de leer.
    hideShowMore: false,
    selectedCity: '',
    selectedType: '',
    currentPage: 1,
    cities: [
      {
        // puede/debe ser un array vacio al comienzo
        value: '',
        text: '',
      },
    ],
    type: [
      {
        // puede/debe ser un array vacio al comienzo
        value: '',
        text: '',
      },
    ],
    houses: {
      // Este objeto sobra
      pagedHouses: [], // Esto sobra
      byId: {},
      allIds: [],
    },
  },
  reducers: {
    loadMoreHouses: (state) => {
      state.currentPage += 1
      state.houses.pagedHouses.push(
        ...getPagedHouses(state.houses, state.currentPage),
      )
    },
    // setCity
    citySelected: (state, action) => {
      const city = action.payload
      state.selectedCity = city
    },
    // setType
    typeSelected: (state, action) => {
      const type = action.payload
      state.selectedType = type
    },
    // Quitar el filtrado del reducer
    filterResults: (state) => {
      state.houses.pagedHouses = state.houses.allIds
        .map((houseId) => state.houses.byId[houseId])
        .filter((house) => {
          state.hideShowMore = true
          //   este tipo de filtrado es demasiado complejo, dividirlo en multiples filtros, en funciones unitarias en carpeta helpers.
          if (state.selectedCity && state.selectedType === '') {
            return house.city === state.selectedCity
          }
          //   este tipo de filtrado es demasiado complejo, dividirlo en multiples filtros, en funciones unitarias en carpeta helpers.
          if (state.selectedType && state.selectedCity === '') {
            return house.type === state.selectedType
          }
          //   este tipo de filtrado es demasiado complejo, dividirlo en multiples filtros, en funciones unitarias en carpeta helpers.
          if (state.selectedCity && state.selectedType) {
            return (
              house.city === state.selectedCity &&
              house.type === state.selectedType
            )
          }
          return true
        })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHouses.pending, (state) => {
      state.reqStatus = 'loading'
    })
    builder.addCase(getHouses.fulfilled, (state, action) => {
      state.reqStatus = 'success'
      action.payload.forEach((house) => {
        state.houses.byId[house.id] = house
        if (!state.houses.allIds.includes(house.id)) {
          state.houses.allIds.push(house.id)
        }
        const isCitySaved = state.cities.findIndex(
          (city) => city.value === house.city,
        )
        if (isCitySaved === -1) {
          state.cities.push({
            value: house.city,
            text: house.city,
          })
        }
        const isTypeSaved = state.type.findIndex(
          (type) => type.value === house.type,
        )
        if (isTypeSaved === -1) {
          state.type.push({
            value: house.type,
            text: house.type,
          })
        }
      })
      state.houses.pagedHouses = getPagedHouses(state.houses, 1)
    })
    builder.addCase(getHouses.rejected, (state) => {
      state.reqStatus = 'error'
    })
  },
})

export const { loadMoreHouses, typeSelected, citySelected, filterResults } =
  housesSlice.actions
export default housesSlice.reducer
