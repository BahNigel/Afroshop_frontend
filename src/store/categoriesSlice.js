import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    categories: [],
    aboutUs: null,
    contactUsResponse: null,
    isLoading: false,
    error: null,
};

// Action to fetch "About Us"
export const getAboutUs = createAsyncThunk("aboutUs/getAboutUs", async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}about_us/`);
        const data = await response.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Action to post a "Contact Us" message
export const postContactUsMessage = createAsyncThunk("contactUs/postContactUsMessage", async (messageData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}contact_us/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messageData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const getCategories = createAsyncThunk("categories/getCategories",
    async(_,thunkAPI)=>{
        const {rejectWithValue} = thunkAPI;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}categroys/?populate=*`)
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message)
        }
    })

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Categories
        builder.addCase(getCategories.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getCategories.rejected, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        });

        // About Us
        builder.addCase(getAboutUs.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getAboutUs.fulfilled, (state, action) => {
            state.aboutUs = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getAboutUs.rejected, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        });

        // Contact Us
        builder.addCase(postContactUsMessage.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(postContactUsMessage.fulfilled, (state, action) => {
            state.contactUsResponse = action.payload;
            state.isLoading = false;
        });
        builder.addCase(postContactUsMessage.rejected, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        });
    }
});

export default categoriesSlice.reducer;
