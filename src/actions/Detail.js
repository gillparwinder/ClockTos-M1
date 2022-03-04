import { ADD_DETAILS, DELETE_DETAILS, LOGIN_DETAILS } from "./types";

export const addDetail = detail => ({
  type: ADD_DETAILS,
  data: detail
});

//export const addDetail = detail => {
//  return dispatch=>{

//    return 
//    {
//      type: ADD_DETAILS
//      data: detail

//     }
//     }
//   };
export const deleteDetail = key => ({
  type: DELETE_DETAILS,
  data: key
});
export const loginDetail = key => ({
  type: LOGIN_DETAILS,
  data: key
});
