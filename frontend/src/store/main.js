import { configureStore } from '@reduxjs/toolkit';

import miscSlice from './misc';
import filesSlice from './files';
import projectSlice from './project';



const store = configureStore({
    reducer: {
        misc: miscSlice.reducer,
        files: filesSlice.reducer,
        project: projectSlice.reducer,
    },
});

export const miscActions = miscSlice.actions;
export const filesAction = filesSlice.actions;
export const projectAction = projectSlice.actions;


export default store;