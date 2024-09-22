import { configureStore } from '@reduxjs/toolkit';

import miscSlice from './misc';
import filesSlice from './files';



const store = configureStore({
    reducer: {
        misc: miscSlice.reducer,
        files: filesSlice.reducer
    },
});

export const miscActions = miscSlice.actions;
export const filesAction = filesSlice.actions;

export default store;