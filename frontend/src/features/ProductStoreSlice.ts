/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = `http://127.0.0.1:8000/api`;

export type Product = {
  id: number;
  product_name: string;
  category: string;
  thumbnail: string;
  price: number;
  description: string;
  isAvailable: boolean;
  old_price: number;
};

export type User = {
  id: number;
  username: string;
  email: string;
};

interface State {
  products: Product[];
  productscategory: Product[];
  user: User[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: null | string;
  token: string;
  isAuthenticated: boolean;
  size: string;
}

const initialState: State = {
  products: [],
  productscategory: [],
  status: "idle",
  error: "",
  token: "",
  user: [],
  isAuthenticated: false,
  size: "",
};

let all_products_id: any;

// Fetch products
export const fetchProducts: any = createAsyncThunk(
  "fetch/fetchProducts",
  async () => {
    const response = await axios.get(`${BASE_URL}/products/`);
    return response.data;
  }
);

// get products by category
export const fetchProductsByCategory: any = createAsyncThunk(
  "get/categorysearch",
  async (category: string) => {
    if (category) {
      const response = await axios.get(
        `${BASE_URL}/products?category=${category}`
      );
      return response.data;
    }
  }
);

// get the current user logged in
export const getUserProfile: any = createAsyncThunk(
  "user/getuser",
  async (token: string) => {
    if (token) {
      const response = await axios.get(`${BASE_URL}/userprofile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.data;
      if (data) return response.data;
    }
  }
);

// edit the user profile
type FormData = {
  id: number;
  username: string;
  email: string;
  profileImage?: File | null;
};

export const customizeUserProfile: any = createAsyncThunk(
  "edit/editUserProfile",
  async (formData: FormData, token) => {
    const { id } = formData;

    if (token) {
      const reponse = await axios.patch(
        `${BASE_URL}/users/${id}/`,
        {
          username: formData.username,
          email: formData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      return reponse.data;
    }
  }
);

// signin to the api app
export const signIn: any = createAsyncThunk("sign/signIn", async (formData) => {
  const response = await axios.post(`${BASE_URL}/auth/`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const token = response.data.token;
  return token;
});

//
export const signUp: any = createAsyncThunk("signup/user", async (formdata) => {
  const response = await axios.post(`${BASE_URL}/users/`, formdata, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
});

export const ProductStoreSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    logout(state) {
      state.token = "";
      toast.success("Logged out successfully", {
        autoClose: 3000,
        hideProgressBar: true,
      });
    },

    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },

    getProductSize(state, action) {
      state.size = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // fetching all products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "pending";
        all_products_id = toast.loading("Fetching store products........", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        toast.done(all_products_id);
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        toast.error("Could not fetch products , try again later.", {
          autoClose: 3000,
          hideProgressBar: true,
        });
        state.error =
          action.error.message || "Could not fetch products , try again later.";
      })

      // fetching by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productscategory = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state) => {
        state.status = "failed";
        toast.error("Search field does not match any categories", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      })

      // get User Profile
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })

      // edit user profile
      .addCase(customizeUserProfile.pending, (state) => {
        state.status = "pending";
      })
      .addCase(customizeUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        const foundUser = state.user.find(
          (user) => user.id === action.payload.id
        );

        if (foundUser) {
          foundUser.username = action.payload.username;
          foundUser.email = action.payload.email;
        }
        toast.success("User profile updated successfully", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      })
      .addCase(customizeUserProfile.rejected, (state) => {
        state.status = "failed";
        toast.error("Coould not user profile , try again later", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      })

      // Authenticate user
      .addCase(signIn.pending, (state) => {
        state.status = "pending";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
        state.isAuthenticated = true;
        toast.success("Logged in successfully", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      })
      .addCase(signIn.rejected, (state) => {
        state.status = "failed";
        toast.error("Invalid username or password", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      })

      // create an account
      .addCase(signUp.pending, (state) => {
        state.status = "pending";
      })
      .addCase(signUp.fulfilled, (state) => {
        state.status = "succeeded";
        toast.success("Account created successfuly , login to continue", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      })
      .addCase(signUp.rejected, (state) => {
        state.status = "failed";
        toast.error("Could not create user account , try again later", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      });
  },
});

export default ProductStoreSlice.reducer;
export const { logout, setIsAuthenticated, getProductSize } =
  ProductStoreSlice.actions;
export const productStoreSlice = (state: { products: State }) => state.products;
