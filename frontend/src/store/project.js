import { createSlice } from '@reduxjs/toolkit';

const initialProjectState = {
    port: null
};

const projectSlice = createSlice({
    name: 'files',
    initialState: initialProjectState,
    reducers: {
        setPort(state, action) {
            state.port = action.payload;
        }
    },
});

export default projectSlice;