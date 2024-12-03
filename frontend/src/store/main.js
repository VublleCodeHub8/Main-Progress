import { configureStore } from '@reduxjs/toolkit';

import miscSlice from './misc';
import filesSlice from './files';
import projectSlice from './project';
import devSlice from './dev';



const store = configureStore({
    reducer: {
        misc: miscSlice.reducer,
        files: filesSlice.reducer,
        project: projectSlice.reducer,
        dev: devSlice.reducer
    },
});

export const miscActions = miscSlice.actions;
export const filesAction = filesSlice.actions;
export const projectAction = projectSlice.actions;
export const devAction = devSlice.actions;


export default store;