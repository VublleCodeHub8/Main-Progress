import { createSlice } from '@reduxjs/toolkit';

const initialFilesState = {
    opened: [],
    selected: null,

};

const filesSlice = createSlice({
    name: 'files',
    initialState: initialFilesState,
    reducers: {
        setOpened(state, action) {
            state.opened = JSON.parse(JSON.stringify(action.payload));
        },
        pushOpened(state, action) {
            state.opened.push(JSON.parse(JSON.stringify(action.payload)));
        },
        removeOpened(state, action) {
            const ind = state.opened.findIndex((i) => i === action.payload);
            state.opened.splice(ind, 1);

        },
        setSelected(state, action) {
            if (state.selected === null || state.selected.path != action.payload.path) {
                state.selected = JSON.parse(JSON.stringify(action.payload));
            }
        }
    },
});

export default filesSlice;