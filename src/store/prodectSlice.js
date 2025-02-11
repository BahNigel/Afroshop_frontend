
import {createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';




export const getProducts = createAsyncThunk('products/getProducts', async (_,thunkAPI) => {
  const { rejectWithValue} =thunkAPI
  console.log(`${process.env.REACT_APP_API_URL}products`)

  try {
    // const response = await axios.get(`http://localhost:1337/api/products?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`);
    const response = await axios.get(`${process.env.REACT_APP_API_URL}products/getProducts/?populate=*`);
  return response.data;
} catch (error) {
    console.log("Error in data loading",error.message);
     return rejectWithValue(error.message)
}
});



//To get single product
export const getSingleProduct = createAsyncThunk("products/getSingleProduct",
async(id,thunkAPI)=>{
    console.log(`${process.env.REACT_APP_API_URL}products`)
    const {rejectWithValue} =thunkAPI;
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}products/${id}/?populate=*`)
        const data = await response.json();
        console.log("nnnnnnnnnnnnnnowwwwwwwwwwwwwwwww", data)
        return data;
    } catch (error) {
        return rejectWithValue(error.message)
    }
})
//filter products
export const filterProducts = createAsyncThunk("products/filterProducts",
async(filter,thunkAPI)=>{
    console.log(`${process.env.REACT_APP_API_URL}products`)
    const {rejectWithValue} =thunkAPI;
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}products/filterProducts/`)
        const data = await response.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message)
    }
}
)



// to get Carousal Products
 export const getCarousalProducts = createAsyncThunk("products/getCarousalProducts",
 async(type,thunkAPI)=>{
    console.log(`${process.env.REACT_APP_API_URL}products`)
     const {rejectWithValue} =thunkAPI;
     try {
         const response = await fetch(`${process.env.REACT_APP_API_URL}products/getCarousalProducts/`)
         const data = await response.json();
         return data;
     } catch (error) {
         return rejectWithValue(error.message)
     }
 })


export const submitRating = createAsyncThunk(
  'products/submitRating',
  async ({ productId, rating }, { getState, rejectWithValue }) => {
    try {
      const { access } = getState().auth.tokens;

      if (!access) {
        // Reject with error message if no access token is found
        return rejectWithValue("No access token found. Please login first.");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}products/${productId}/submitRating/`,
        { productId, rating },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      console.log('Rating submitted:', response.data);

      // Assuming the response includes the updated rating data for that product
      return { productId, rating: response.data }; 
    } catch (error) {
      // Error handling: if the error is from axios response, use error.response, else a network or other issue
      console.error('Error submitting rating:', error.response?.data || error.message);

      // Return the error message with rejectWithValue
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProductRating = createAsyncThunk('products/getProductRating', async (productId, { getState, rejectWithValue }) => {
    const { access } = getState().auth.tokens;  // Get access token from Redux state

    if (!access) {
        // Reject with error message if no access token is found
        return rejectWithValue("No access token found. Please login first.");
    }

    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}products/${productId}/getProductRating/`, 
            {
                headers: {
                    Authorization: `Bearer ${access}`,  // Include the token in the headers
                },
            }
        );
        return response.data;  // Return the product rating data
    } catch (error) {
        console.log("Error fetching product rating:", error.message);
        return rejectWithValue(error.message);  // Reject if there's an error
    }
});

  


 // to get Featured Products 
 export const getFeaturedProducts = createAsyncThunk("products/getFeaturedProducts",
 async(type,thunkAPI)=>{
    console.log(`${process.env.REACT_APP_API_URL}products`)
     const {rejectWithValue} =thunkAPI;
     try {
         const response = await fetch(`${process.env.REACT_APP_API_URL}products/getFeaturedProducts/`)
         const data = await response.json();
         return data;
     } catch (error) {
         return rejectWithValue(error.message)
     }
 })

  // to get  TrendProducts Products 
  export const getTrendProducts = createAsyncThunk("products/getTrendProducts",
  async(type,thunkAPI)=>{
      const {rejectWithValue} =thunkAPI;
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}products/getTrendProducts/`)
          const data = await response.json();
          return data;
      } catch (error) {
          return rejectWithValue(error.message)
      }
  })
  


// export const getFeaturedProducts = useFetchProduct("getFeaturedProducts","featured")


const initialState ={
    products:[],
    singleProduct:null,
    isLoding:false,
    filterProducts:[],
    error:null,
    cartProductIds:[],
    carousalProducts:[],
    featuredProducts:[],
    trendProducts:[]
}


const productSlice = createSlice({

    name:'products',
    initialState,
    reducers: {
        // To add product
        addToCart: (state, action) => {
            const product = state.cartProductIds.find(item => item.id === action.payload.id);
            
            if (!product) {
              // Product is not in the cart, add it
              const productToAdd = { ...action.payload, cart_bulk: action.payload.bulk };
              state.cartProductIds.push(productToAdd);
            } else {
              // Product is already in the cart, update its quantity and cart_bulk
              product.quantity = action.payload.quantity;
              product.cart_bulk = action.payload.bulk;
            }
            
            // Save updated cart to localStorage
            localStorage.setItem('cartProductIds', JSON.stringify(state.cartProductIds));
          },
          
          
        // To remove product
        removeFromCart: (state, action) => {
          const index = state.cartProductIds.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.cartProductIds.splice(index, 1);
            // Save updated cart to localStorage
            localStorage.setItem('cartProductIds', JSON.stringify(state.cartProductIds));
          }
        },
        // To clear all items
        clearAllItems: (state) => {
          state.cartProductIds = [];
          // Clear cart from localStorage
          localStorage.removeItem('cartProductIds');
        },
        // Load cart from localStorage
        loadCartFromLocalStorage: (state) => {
          const storedCart = localStorage.getItem('cartProductIds');
          if (storedCart) {
            state.cartProductIds = JSON.parse(storedCart);
          }
        }
      },
     
      extraReducers: (builder) => {
        // To Get all products
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.isLoding = false;
            state.error = null;
            state.products = action.payload;
        });
        builder.addCase(getProducts.rejected, (state, action) => {
            state.isLoding = false;
            state.error = action.payload;
            console.log("Error in data loading", action.payload);
        });
        builder.addCase(getProducts.pending, (state, action) => {
            state.isLoding = true;
        });

        builder.addCase(getProductRating.fulfilled, (state, action) => {
            state.isLoding = false;
            state.error = null;
            state.singleProduct.rating = action.payload.rating;  // Assuming the response contains the rating
        });
        builder.addCase(getProductRating.rejected, (state, action) => {
            state.isLoding = false;
            state.error = action.payload;
        });
        builder.addCase(getProductRating.pending, (state) => {
            state.isLoding = true;
        });
        
    
        // To get single product
        builder.addCase(getSingleProduct.fulfilled, (state, action) => {
            state.isLoding = false;
            state.error = null;
            state.singleProduct = action.payload;
        });
        builder.addCase(getSingleProduct.rejected, (state, action) => {
            state.isLoding = false;
            state.error = action.payload;
            console.log("Error in data loading", action.payload);
        });
        builder.addCase(getSingleProduct.pending, (state, action) => {
            state.isLoding = true;
        });
    
        // To filter products
        builder.addCase(filterProducts.fulfilled, (state, action) => {
            state.isLoding = false;
            state.error = null;
            state.filterProducts = action.payload;
        });
        builder.addCase(filterProducts.rejected, (state, action) => {
            state.isLoding = false;
            state.error = action.payload;
            console.log("Error in data loading", action.payload);
        });
        builder.addCase(filterProducts.pending, (state, action) => {
            state.isLoding = true;
        });
    
        // To get featured products
        builder.addCase(getFeaturedProducts.fulfilled, (state, action) => {
            state.isLoding = false;
            state.error = null;
            state.featuredProducts = action.payload;
        });
        builder.addCase(getFeaturedProducts.rejected, (state, action) => {
            state.isLoding = false;
            state.error = action.payload;
            console.log("Error in data loading", action.payload);
        });
    
        // To get Carousal Products
        builder.addCase(getCarousalProducts.fulfilled, (state, action) => {
            state.isLoding = false;
            state.error = null;
            state.carousalProducts = action.payload;
        });
        builder.addCase(getCarousalProducts.rejected, (state, action) => {
            state.isLoding = false;
            state.error = action.payload;
            console.log("Error in data loading", action.payload);
        });
    
        // To get Trend Products
        builder.addCase(getTrendProducts.fulfilled, (state, action) => {
            state.isLoding = false;
            state.error = null;
            state.trendProducts = action.payload;
        });
        builder.addCase(getTrendProducts.rejected, (state, action) => {
            state.isLoding = false;
            state.error = action.payload;
            console.log("Error in data loading", action.payload);
        });
    
        // To submit product rating
        builder.addCase(submitRating.fulfilled, (state, action) => {
            state.isLoding = false;
            state.error = null;
            console.log("Rating submitted successfully:", action.payload);
            // Optionally update product rating in state if needed
            const updatedProduct = state.products.find(product => product.id === action.payload.productId);
            if (updatedProduct) {
                updatedProduct.rating = action.payload.rating;  // Or any other required data from response
            }
        });
        builder.addCase(submitRating.rejected, (state, action) => {
            state.isLoding = false;
            state.error = action.payload;
            console.log("Error in submitting rating:", action.payload);
        });
        builder.addCase(submitRating.pending, (state) => {
            state.isLoding = true;
        });
    }
    

})

export const { addToCart, removeFromCart, clearAllItems, loadCartFromLocalStorage } = productSlice.actions;
export const selectCartProductIds = (state) => state.products.cartProductIds;


// Loading cart from localStorage on initial load
export const initializeCart = () => (dispatch) => {
    dispatch(loadCartFromLocalStorage());
  };
  
  export default productSlice.reducer;
