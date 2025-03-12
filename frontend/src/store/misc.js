import { createSlice } from '@reduxjs/toolkit';
import { set } from 'react-hook-form';

const initialMiscState = {
    toastMsg: null,
    login: false,
    token: { token: null, expiry: null },
    fallback: false,
    role: "user",
    email: null,
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
        },
        setRole(state, action) {
            state.role = action.payload;
        },
        setEmail(state, action) {
            state.email = action.payload;
        }
    },
});

export default miscSlice;