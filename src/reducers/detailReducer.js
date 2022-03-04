const {
  ADD_DETAILS,
  DELETE_DETAILS,
  LOGIN_DETAILS,
} = require('../actions/types');

const initialState = {
  DetailList: [],
  LoginData: [],
};

const detailReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_DETAILS:
      return {
        ...state,
        DetailList: state.DetailList.concat({
          key: Math.random(),
          name: action.data,
        }),
      };
    case DELETE_DETAILS:
      ////console.log(action);

      return {
        ...state,
        DetailList: state.DetailList.filter((item) => item.key !== action.data),
      };
    case LOGIN_DETAILS:
      ////console.log(action);
      return {
        ...state,
        LoginData: action.data,
      };
    default:
      return state;
  }
};

export default detailReducer;
