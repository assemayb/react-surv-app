import {
    AUTH_FAIL,
    AUTH_LOGOUT,
    AUTH_START,
    AUTH_SUCCESS,
    AUTH_SIGNUP,
  } from "./actionTypes";
  
  import axios from "axios";
  import { authURL } from "../../constants";
  
  export const authStart = () => {
    return {
      type: AUTH_START,
    };
  };
  
  export const authSuccess = (token, username) => {
    return {
      type: AUTH_SUCCESS,
      token,
      username,
    };
  };
  
  export const authFail = (err) => {
    return {
      type: AUTH_FAIL,
      error: err,
    };
  };
  
  export const authLogout = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
    localStorage.clear();
    if (refreshToken && accessToken) {
      axios
        .post(`${authURL}/logout`, { token: refreshToken })
        .then((res) => {
          console.log(res.status);
        })
        .catch((err) => console.error(err));
    }
    return {
      type: AUTH_LOGOUT,
    };
  };
  
  export const authSignup = (info) => {
    if (info) {
      const { msg , status } = info;
      localStorage.setItem("msg", msg );
      localStorage.setItem("status", status );
    }
    return {
      type: AUTH_SIGNUP,
      info,
    };
  };
  
  export const authLogin = (username, password) => {
    localStorage.clear();
    return (dispatch) => {
      axios
        .post("http://127.0.0.1:5000/login", {
          username,
          password,
        })
        .then((res) => {
          let msg = res.data.msg;
          if (msg) {
            dispatch(authFail(msg));
          } else {
            console.log(res.data);
            const { accessToken, refreshToken, username } = res.data;
            const expDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem("username", username);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("expDate", expDate);
  
            dispatch(authStart());
            dispatch(authSuccess(accessToken, username));
          }
        })
        .catch((err) => {
          dispatch(authFail(err));
        });
    };
  };
  
  export const authSignUp = (username, password, email) => {
    return (dispatch) => {
      let resData = null;
      axios
        .post("http://127.0.0.1:5000/create-user", {
          username,
          password,
          email
        })
        .then((res) => {
          resData = { status: res.status, msg: res.data.msg }
          console.log(resData)
          dispatch(authSignup(resData));
        })
        .catch((err) => {
          resData = { status: err.response.status, msg: err.response.data.msg }
          console.log(resData)
          dispatch(authSignup(resData))
        });
    };
  };
  
  export const authCheckState = () => {
    let username = localStorage.getItem("username");
    let accessToken = localStorage.getItem("accessToken");
    let refreshToken = localStorage.getItem("refreshToken");
  
    let exp = localStorage.getItem("expDate");
    let expDate = exp && new Date(exp);
    const nowDate = new Date();
  
    console.log("Auth CheckState function");
    return (dispatch) => {
      if (refreshToken && accessToken) {
        if (expDate > nowDate) {
          dispatch(authSuccess(accessToken, username));
        } else {
          console.log("getting a new token, brb!");
          axios
            .post(`${authURL}/token`, { token: refreshToken })
            .then((res) => {
              const acT = res.data.accessToken;
              console.log(res.data);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("expDate");
              localStorage.setItem("accessToken", acT);
              const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
              localStorage.setItem("expDate", expirationDate);
              dispatch(authStart());
              dispatch(authSuccess(acT, username));
            })
            .catch((err) => console.error(err));
        }
      } else {
        console.log("No tokens");
      }
    };
  };