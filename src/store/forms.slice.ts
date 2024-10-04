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
      const form = action.payload;
      const foundIndex = state.all.findIndex((f) => f.id === form.id);

      if (foundIndex !== -1) {
        console.log("found");
        state.all[foundIndex] = form;
      } else {
        console.log("not found");
        state.all.push({ ...form, id: state.all.length });
      }
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
