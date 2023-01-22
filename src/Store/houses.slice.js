/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { urls } from '../constants'

export const getHouses = createAsyncThunk('houses/getHouses',
  async (currentPage) => {
    try {
     const queryParams = new URLSearchParams({
      _page: currentPage,
      _limit: 9
    });

      const res = await fetch(`${urls.houses}?${queryParams.toString()}`)
      const data = await res.json();
      return data
    } catch(err) {
      return err.response.data
    }
  }
)

const initialState = {
    reqStatus: {
      isSuccess: false,
      isError: false,
      isLoading: false,
      hasMore: true,
    },
    hideShowMore: false,
    selectedCity: null,
    selectedType: null,
    currentPage: 1,
    cities: [],
    type: [],
    houses: {
      byId: {},
      allIds: [],
    }
}

export const housesSlice = createSlice({
    name: 'houses',
    initialState,
    reducers: {
      loadMoreHouses: (state) => {
        state.currentPage += 1;
      },
      setFilters: (state, action) => {  
        const {city, type} = action.payload;
        state.selectedCity = city;
        state.selectedType = type;
      }
    },
    extraReducers: (builder) => {
      builder.addCase(getHouses.pending, (state) => {
        state.reqStatus = {
          isSuccess: false,
          isError: false,
          isLoading: true
        }
      })
      builder.addCase(getHouses.fulfilled, (state, action) => {
        state.reqStatus = {
          isSuccess: true,
          isError: false,
          isLoading: false,
          hasMore: action.payload.length !== 0,
        }
        
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
      })
      builder.addCase(getHouses.rejected, (state) => {
        state.reqStatus = {
          isSuccess: false,
          isError: true,
          isLoading: false
        }
      })
    }
  });

export const { loadMoreHouses, setFilters } = housesSlice.actions;
export default housesSlice.reducer

