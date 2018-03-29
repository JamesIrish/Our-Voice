import expect from "expect";
import {createStore} from "redux";
import rootReducer from "../reducers";
import initialState from "../reducers/initialState";

describe("Store", () => {
  it("Should handle creating courses", () => {
    // Arrange
    const store = createStore(rootReducer, initialState);
    const course = {
      title: "Clean Code"
    };

  });
});
