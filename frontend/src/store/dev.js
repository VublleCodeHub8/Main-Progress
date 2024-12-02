import { createSlice } from '@reduxjs/toolkit';

const initialDevState = {
  templates: [],
  error: null,
  loading: false,
};

const devSlice = createSlice({
  name: 'dev',
  initialState: initialDevState,
  reducers: {
    setTemplates(state, action) {
      state.templates = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setTemplates, setError, setLoading } = devSlice.actions;
export default devSlice.reducer;