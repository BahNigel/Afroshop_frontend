import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch user data from backend if not available in localStorage
const fetchUserDataFromBackend = async (accessToken) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}auth/user/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const handlePaymentSuccess = createAsyncThunk(
    "checkout/handlePaymentSuccess",
    async ({ orderId, details }, { getState, dispatch, rejectWithValue }) => {
      const state = getState();
      const access = state.auth?.tokens?.access; // Adjust based on your store structure
  
      if (!access) {
        return rejectWithValue("No access token found. Please login first.");
      }
  
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}payments/${orderId}/update-status/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`, // Ensure the token is correctly passed
            },
            body: JSON.stringify({
              status: "payed",
              orderId: details?.id || null,
              payer: details?.payer || null,
              purchase_units: details?.purchase_units || null,
            }),
          }
        );
  
        if (response.ok) {
          const result = await response.json();
          alert("Payment status updated successfully!");
          dispatch(getUserCheckoutData()); // Refresh checkout data
          return result;
        } else {
          const error = await response.json();
          console.error("Failed to update payment status:", error);
          return rejectWithValue("Failed to update payment status.");
        }
      } catch (err) {
        console.error("Error updating payment status:", err);
        return rejectWithValue("An error occurred while updating payment status.");
      }
    }
  );

// Login User
export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue, dispatch }) => {
    try {
        // Clear existing tokens and user data before login
        dispatch(authSlice.actions.clearUserData());

        const response = await axios.post(`${process.env.REACT_APP_API_URL}auth/login/`, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Register User
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue, dispatch }) => {
    try {
        // Clear existing tokens and user data before registration
        dispatch(authSlice.actions.clearUserData());

        const response = await axios.post(`${process.env.REACT_APP_API_URL}auth/register/`, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Fetch logged-in user's checkout data
export const getUserCheckoutData = createAsyncThunk('auth/getUserCheckoutData', async (_, { getState, rejectWithValue }) => {
    const { access } = getState().auth.tokens;

    if (!access) {
        return rejectWithValue("No access token found. Please login first.");
    }

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}checkout/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            return rejectWithValue("Session expired. Please log in again.");
        }
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Delete the entire checkout
export const deleteCheckout = createAsyncThunk('auth/deleteCheckout', async (checkoutId, { getState, rejectWithValue }) => {
    const { access } = getState().auth.tokens;

    if (!access) {
        return rejectWithValue("No access token found. Please login first.");
    }

    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}checkout/${checkoutId}/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            return rejectWithValue("Session expired. Please log in again.");
        }
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Fetch logged-in user's Order data
export const getUserOrderData = createAsyncThunk('auth/getUserOrderData', async (_, { getState, rejectWithValue }) => {
    const { access } = getState().auth.tokens;

    if (!access) {
        return rejectWithValue("No access token found. Please login first.");
    }

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}order/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            return rejectWithValue("Session expired. Please log in again.");
        }
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Delete order
export const deleteOrder = createAsyncThunk('auth/deleteOrder', async (orderId, { getState, rejectWithValue }) => {
    const { access } = getState().auth.tokens;

    if (!access) {
        return rejectWithValue("No access token found. Please login first.");
    }

    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}order/${orderId}/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            return rejectWithValue("Session expired. Please log in again.");
        }
        return rejectWithValue(error.response?.data || error.message);
    }
});

// place order
export const pleaseOrder = createAsyncThunk('auth/pleaseOrder', async (orderData, { getState, rejectWithValue, dispatch }) => {
    const { access } = getState().auth.tokens;

    if (!access) {
        return rejectWithValue("No access token found. Please login first.");
    }
    
    try {
        console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", orderData)
        const response = await axios.post(`${process.env.REACT_APP_API_URL}order/`, orderData, {
            headers: {
                Authorization: `Bearer ${access}`,
            }
        });
        dispatch(deleteCheckout(orderData.id));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Delete an item in checkout
export const deleteCheckoutItem = createAsyncThunk('auth/deleteCheckoutItem', async ({ checkoutId, itemId }, { getState, rejectWithValue }) => {
    const { access } = getState().auth.tokens;

    if (!access) {
        return rejectWithValue("No access token found. Please login first.");
    }

    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}checkout/${checkoutId}/item/${itemId}/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            return rejectWithValue("Session expired. Please log in again.");
        }
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Update User Data
export const updateUser = createAsyncThunk('auth/updateUser', async (userData, { getState, rejectWithValue }) => {
    const { access } = getState().auth.tokens;

    if (!access) {
        return rejectWithValue("No access token found. Please login first.");
    }

    try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}auth/update/`, userData, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });

        // Update localStorage with the new user data after a successful response
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Get user data from localStorage or fetch from backend if empty
const tokens = localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')) : { access: null, refresh: null };
let initialUserData = JSON.parse(localStorage.getItem('userData')) || null;

if (!initialUserData && tokens.access) {
    // Fetch user data from backend if not in localStorage
    fetchUserDataFromBackend(tokens.access).then(userData => {
        localStorage.setItem('userData', JSON.stringify(userData));
    }).catch(error => console.error("Error fetching user data:", error));
}

const isLogin = localStorage.getItem('isLogin') ? JSON.parse(localStorage.getItem('isLogin')) : false;

const initialState = {
    userData: initialUserData,
    isLogin,
    tokens,
    isLoading: false,
    checkoutData: [],
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Clear user data and tokens
        clearUserData(state) {
            state.userData = null;
            state.tokens = { access: null, refresh: null };
            state.isLogin = false;
            state.checkoutData = [];

            localStorage.removeItem('userData');
            localStorage.removeItem('tokens');
            localStorage.setItem('isLogin', false);
            console.log("User data cleared");
        },

        // Logout the user
        logoutUser(state) {
            state.userData = null;
            state.tokens = { access: null, refresh: null };
            state.isLogin = false;
            state.checkoutData = [];
            state.error = null;

            localStorage.removeItem('userData');
            localStorage.removeItem('tokens');
            localStorage.setItem('isLogin', false);
            console.log("User logged out");
        },
    },

    extraReducers: (builder) => {
        // Login fulfilled
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.userData = action.payload.user;
            state.tokens = { access: action.payload.access, refresh: action.payload.refresh };
            state.isLogin = true;

            localStorage.setItem('userData', JSON.stringify(action.payload.user));
            localStorage.setItem('tokens', JSON.stringify(state.tokens));
            localStorage.setItem('isLogin', true);
            console.log("Login Successful, Tokens Saved:", state.tokens);
        });

        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isLogin = false;
            localStorage.setItem('isLogin', false);
            localStorage.removeItem('tokens');
            console.error("Login Failed:", action.error.message);
        });

        // Register fulfilled
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.userData = action.payload.user;
            state.tokens = { access: action.payload.access, refresh: action.payload.refresh };
            state.isLogin = true;

            localStorage.setItem('userData', JSON.stringify(action.payload.user));
            localStorage.setItem('tokens', JSON.stringify(state.tokens));
            localStorage.setItem('isLogin', true);
            console.log("Registration Successful, Tokens Saved:", state.tokens);
        });

        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isLogin = false;
            localStorage.setItem('isLogin', false);
            localStorage.removeItem('tokens');
            console.error("Registration Failed:", action.error.message);
        });

        // Fetch checkout data fulfilled
        builder.addCase(getUserCheckoutData.fulfilled, (state, action) => {
            state.checkoutData = action.payload;
            state.isLoading = false;
        });

        builder.addCase(getUserCheckoutData.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getUserCheckoutData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });


        // Fetch Order data fulfilled
        builder.addCase(getUserOrderData.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(getUserOrderData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderData = action.payload;
        })
        builder.addCase(getUserOrderData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

         // Fetch payment data fulfilled
         builder.addCase(handlePaymentSuccess.fulfilled, (state, action) => {
            state.checkoutData = action.payload;
            state.isLoading = false;
        });

        builder.addCase(handlePaymentSuccess.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(handlePaymentSuccess.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Update user data fulfilled
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.userData = action.payload.user;
            localStorage.setItem('userData', JSON.stringify(action.payload.user));
        });

        builder.addCase(updateUser.rejected, (state, action) => {
            state.error = action.payload;
        });
    },
});

export const { clearUserData, logoutUser } = authSlice.actions;

export default authSlice.reducer;
