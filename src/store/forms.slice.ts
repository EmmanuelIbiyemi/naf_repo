import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { FormCreateType2 } from "../types/forms";

interface AppState {
  current: FormCreateType2;
  all: FormCreateType2[];
}

const initialState: AppState = {
  current: {
    fee: 0,
    name: "Untitled Form",
    program_id: 13,
    sections: [],
  },
  all: [],
};

export const formSlice = createSlice({
  name: "formSlice",
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<FormCreateType2>) => {
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
    setCurrentForm: (state, action: PayloadAction<FormCreateType2>) => {
      state.current = action.payload;
    },
    clearCurrentForm: (state) => {
      state.current = {
        fee: 0,
        name: "",
        program_id: 0,
        sections: [],
      };
    },
  },
});

export const { addForm, removeForm, setCurrentForm, clearCurrentForm } =
  formSlice.actions;
export const selectForms = (state: RootState) => state.forms.all;
export const selectCurrentForm = (state: RootState) => state.forms.current;
export default formSlice.reducer;
