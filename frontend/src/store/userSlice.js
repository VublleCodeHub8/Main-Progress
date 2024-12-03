import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Buffer } from "buffer";

// Fetch user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/user/getuserdata", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (
        data.profilePic &&
        data.profilePic.data &&
        data.profilePic.contentType
      ) {
        const base64Image = `data:${data.profilePic.contentType};base64,${
          typeof data.profilePic.data === "string"
            ? data.profilePic.data
            : Buffer.from(data.profilePic.data).toString("base64")
        }`;
        data.profilePicUrl = base64Image;
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ token, updatedUser, selectedFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("username", updatedUser.username.trim());
      if (updatedUser.bio && updatedUser.bio.trim()) {
        console.log("mellooooo");
        formData.append("bio", updatedUser.bio.trim());
      }
      console.log("mellooooo2");
      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      const response = await fetch("http://localhost:3000/user/addmoredata", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.message ||
            (responseData.errors && responseData.errors.join(", ")) ||
            "Unknown error"
        );
      }
      console.log(responseData);
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    isEditMode: false,
    error: null,
  },
  reducers: {
    setEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.user = action.payload.result;
        const data = action.payload.result;
        const base64Image = `data:${data.profilePic.contentType};base64,${
          typeof data.profilePic.data === "string"
            ? data.profilePic.data
            : Buffer.from(data.profilePic.data).toString("base64")
        }`;
        state.user.profilePicUrl = base64Image;
        state.isEditMode = false;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setEditMode } = userSlice.actions;

export default userSlice;
