import React from "react";

export const initialState = {
  location: "",
  eventType: "",
  tables: "",
  date: "",
  time: "",
  price: "",
};

export function searchReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}