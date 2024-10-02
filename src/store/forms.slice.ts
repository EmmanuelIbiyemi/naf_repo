import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { FormType } from "../types/forms";

interface AppState {
  current: FormType | undefined;
  all: FormType[];
}

const initialState: AppState = {
  current: undefined,
  all: [],
};

export const formSlice = createSlice({
  name: "formSlice",
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<FormType>) => {
      state.all.push({ ...action.payload, id: state.all.length });
    },
    removeForm: (state, action: PayloadAction<number>) => {
      state.all = state.all.filter((form) => form.id === action.payload);
    },
    setCurrentForm: (state, action: PayloadAction<FormType | undefined>) => {
      state.current = action.payload;
    },
  },
});

export const { addForm, removeForm, setCurrentForm } = formSlice.actions;
export const selectForms = (state: RootState) => state.forms.all;
export const selectCurrentForm = (state: RootState) => state.forms.current;
export default formSlice.reducer;
