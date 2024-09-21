import { createSlice } from '@reduxjs/toolkit';

const initialMiscState = {
    toastMsg: null,
    login: false,
    token: { token: null, expiry: null },
    fallback: false

};

const miscSlice = createSlice({
    name: 'misc',
    initialState: initialMiscState,
    reducers: {
        setToast(state, action) {
            state.toastMsg = action.payload;
        },
        setLogin(state, action) {
            state.login = action.payload;
        },
        setToken(state, action) {
            state.token = { ...action.payload };
        },
        setFallback(state, action) {
            state.fallback = action.payload;
        }
    },
});

export default miscSlice;