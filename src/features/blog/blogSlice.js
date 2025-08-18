import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching blogs
export const getBlogsContent = createAsyncThunk(
  "blog/getBlogsContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/blog");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for creating a blog
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/blog", blogData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for updating a blog
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, blogData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/blog/${id}`, blogData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for deleting a blog
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/blog/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const blogSlice = createSlice({
  name: "blog",
  initialState: {
    isLoading: false,
    blogs: [],
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get blogs
      .addCase(getBlogsContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBlogsContent.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle single object, array, or wrapped response
        let blogs = action.payload;
        if (action.payload && action.payload.data) {
          blogs = action.payload.data;
        }
        // If it's a single object, wrap it in an array
        if (blogs && !Array.isArray(blogs)) {
          blogs = [blogs];
        }
        // If it's null/undefined, use empty array
        state.blogs = blogs || [];
      })
      .addCase(getBlogsContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle response that might be wrapped in a data property
        const newBlog = action.payload.data || action.payload;
        state.blogs.push(newBlog);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle response that might be wrapped in a data property
        const updatedBlog = action.payload.data || action.payload;
        const index = state.blogs.findIndex(
          (blog) => blog._id === updatedBlog._id
        );
        if (index !== -1) {
          state.blogs[index] = updatedBlog;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError } = blogSlice.actions;
export default blogSlice.reducer;
