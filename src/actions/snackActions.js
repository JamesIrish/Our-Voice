import * as types from "./actionTypes";

export function showSnack(text){
  return { type: types.SHOW_SNACK, text: text };
}
export function clearSnack() {
  return { type: types.CLEAR_SNACK };
}
