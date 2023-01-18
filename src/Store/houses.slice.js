/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { urls } from '../constants'


function getPagedHouses(state, currentPage) {
  if (currentPage === 1) {
    return state.allIds.slice(0, 9).map((houseId) => state.byId[houseId]);
  } 
  
  const nextHouses = state.allIds.slice(((currentPage * 9) - 9), currentPage * 8).map((houseId) => state.byId[houseId])
  if (nextHouses.length < 9) {
   state.hideShowMore = true;
  }
 return nextHouses;
  
}

export const getHouses = createAsyncThunk('houses/getHouses',
  async () => {
    const res = await fetch(urls.houses)
    const data = await res.json()
    return data
  }
)
export const housesSlice = createSlice({
    name: 'houses',
    initialState: {
        reqStatus: 'initial',
        hideShowMore: false,
        selectedCity: "",
        selectedType:"",
        currentPage: 1,
        cities: [{
          value: "",
          text: ""
        }],
        type: [{
          value: "",
          text: ""
        }],
        houses: {
          pagedHouses: [],
          byId: {},
          allIds: [],
        }
    },
    reducers: {
      loadMoreHouses: (state) => {
        state.currentPage += 1;
        state.houses.pagedHouses.push(...getPagedHouses(state.houses, state.currentPage))
      },
      citySelected: (state, action) => {
        const city = action.payload;
        state.selectedCity = city
      },
      typeSelected: (state, action) => {
        const type = action.payload;
        state.selectedType = type
      },
      filterResults: (state) => {
        state.houses.pagedHouses = state.houses.allIds.map((houseId) => state.houses.byId[houseId]).filter((house) => {
          state.hideShowMore = true;
          if(state.selectedCity && state.selectedType === "") {
            return house.city === state.selectedCity 

          }
          if(state.selectedType && state.selectedCity === "") {
            return house.type === state.selectedType
          }
          if(state.selectedCity && state.selectedType) {
            return house.city === state.selectedCity && house.type === state.selectedType
          }
          return true;
      })
        }
    },
    extraReducers: (builder) => {
      builder.addCase(getHouses.pending, (state) => {
        state.reqStatus = 'loading'
      })
      builder.addCase(getHouses.fulfilled, (state, action) => {
        state.reqStatus = 'success'
        action.payload.forEach((house) => { 
          state.houses.byId[house.id] = house
          if(!state.houses.allIds.includes(house.id)) {
            state.houses.allIds.push(house.id)
          }
          const isCitySaved = state.cities.findIndex((city) => city.value === house.city);
          if(isCitySaved === -1) {
            state.cities.push({
              value: house.city,
              text: house.city
            })
          }
          const isTypeSaved = state.type.findIndex((type) => type.value === house.type);
          if(isTypeSaved === -1) {
            state.type.push({
              value: house.type,
              text: house.type
            })
          }
        })
        state.houses.pagedHouses = getPagedHouses(state.houses, 1);
      })
      builder.addCase(getHouses.rejected, (state) => {
        state.reqStatus = 'error'
      })
    }
  });

export const { loadMoreHouses, typeSelected, citySelected, filterResults } = housesSlice.actions;
export default housesSlice.reducer

