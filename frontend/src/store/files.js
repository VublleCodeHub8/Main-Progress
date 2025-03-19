import { createSlice } from '@reduxjs/toolkit';

const initialFilesState = {
    opened: [],
    selected: null,
    openedFiles: []

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
            console.log(JSON.parse(JSON.stringify(action.payload)));
            if (!state.openedFiles.some((i) => i.fullPath == action.payload.fullPath)) {
                state.openedFiles.push(JSON.parse(JSON.stringify(action.payload)));
            }
        },
        removeSelectedFile(state, action) {
            state.openedFiles = state.openedFiles.filter((i) => i.fullPath != action.payload.fullPath);
            state.selected = null;
        },
        clearAllSelectedFiles(state, action) {
            state.openedFiles = [];
            state.selected = null;
        }
    },
});

export default filesSlice;