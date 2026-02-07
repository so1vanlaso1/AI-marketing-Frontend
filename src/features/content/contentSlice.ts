import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../lib/withType";
import { axiosContent } from "../../axios/axiosContent";
import { AxiosError } from "axios";

interface ContentData {
  contentId: string;
  referenceId: string;
  languageId: string;
  name: string;
  description?: string | null;
  info?: string | null;
  createDate: string;
  updateDate?: string | null;
  isPublish: boolean;
}

interface AllContents {
  contents: ContentData[];
  totalRecords: number;
  status?: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AllContents = {
  contents: [],
  totalRecords: 0,
  status: "idle",
};


export const getContentsData = createAppAsyncThunk(
  'content/getContentsData',
  async () => {
    try {
      const response = await axiosContent.get('/content');
      // response.data is the array
      return {
        contents: response.data,
        totalRecords: response.data.length
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.status);
        throw error.response?.data ?? error.message ?? "An unknown error occurred";
      }
      if (error instanceof Error) {
        throw error.message;
      }
      throw "An unknown error occurred";
    }
  },
);


export const editContentData = createAppAsyncThunk(
  'content/editContentData',
  async (content: ContentData) => {
    try {
      const response = await axiosContent.put(`/content/${content.contentId}`, content);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.status);
        throw error.response?.data ?? error.message ?? "An unknown error occurred";
      }
      if (error instanceof Error) {
        throw error.message;
      }
      throw "An unknown error occurred";
    }
  },
);

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {},
    extraReducers: (builder) => {
    builder
      .addCase(getContentsData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getContentsData.fulfilled, (state, action: { payload: AllContents }) => {
        state.status = "succeeded";
        state.contents = action.payload.contents;
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(getContentsData.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(editContentData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editContentData.fulfilled, (state, action: { payload: ContentData }) => {
        state.status = "succeeded";
        const index = state.contents.findIndex(content => content.contentId === action.payload.contentId);
        if (index !== -1) {
          state.contents[index] = action.payload;
        }
      })
      .addCase(editContentData.rejected, (state) => {
        state.status = "failed";
      });
    },
});




export const selectContents = (state: { content: AllContents }) => state.content.contents;
export const selectContentStatus = (state: { content: AllContents }) => state.content.status;
export default contentSlice.reducer;
