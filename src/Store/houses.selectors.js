const selectHouses = (state) => {
    const housesArray = state.houses.allIds.map((houseId) => state.houses.byId[houseId]);
  
    if (state.selectedCity && !state.selectedType) {
      return housesArray.filter(house => house.city === state.selectedCity)
    }
  
    if (state.selectedType && !state.selectedCity) {
      return housesArray.filter(house => house.type === state.selectedType)
    }
  
    if(state.selectedCity && state.selectedType) {
      return housesArray.filter(house => house.city === state.selectedCity && house.type === state.selectedType)
    }
  
    return housesArray;
}

const selectReqStatus = (state) => state.reqStatus;
const selectCurrentPage = (state) => state.currentPage;


export {selectHouses, selectReqStatus, selectCurrentPage};