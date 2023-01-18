import { configureStore } from '@reduxjs/toolkit'
import housesReducer from './houses.slice';

export default configureStore({ 
    reducer: {
        housesStore: housesReducer,
    }
})