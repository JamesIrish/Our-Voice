import * as types from "./actionTypes";

export function showSnack(text){
  return {type: types.SHOW_SNACK, text: text};
}
