import { configureStore } from '@reduxjs/toolkit';

import miscSlice from './misc';



const store = configureStore({
    reducer: { misc: miscSlice.reducer },
});

export const miscActions = miscSlice.actions;

export default store;