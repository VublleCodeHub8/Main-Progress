import { configureStore } from '@reduxjs/toolkit';

import miscSlice from './misc';
import filesSlice from './files';
import projectSlice from './project';

import userSlice from './userSlice';

const store = configureStore({
    reducer: {
        misc: miscSlice.reducer,
        files: filesSlice.reducer,
        project: projectSlice.reducer,
        user : userSlice.reducer,
    },
});

export const miscActions = miscSlice.actions;
export const filesAction = filesSlice.actions;
export const projectAction = projectSlice.actions;
export const userAction = userSlice.actions;

export default store;