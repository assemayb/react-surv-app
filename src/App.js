import React, { Fragment } from "react";
import "./App.css"
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router} from "react-router-dom";
import { connect } from "react-redux";

import BaseRouter from "./routes";
import BaseMenu from "./components/BaseMenu";
import { Footer } from "./components/Footer";
import { authCheckState } from "./store/actions/auth";

function App(props) {
  if (props.refTokenExist) {
    props.checkState();
  }
  const quarter = 15 * 1000 * 60;
  setInterval(() => props.checkState(), quarter);

  return (
    <div className="App">
      <Router>
        <BaseMenu />
        <BaseRouter />
        <Footer />
      </Router>
    </div>
  );
}
const mapStateToProps = (state) => {
  const refToken = localStorage.getItem("refreshToken");
  return {
    token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    refTokenExist: refToken !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkState: () => dispatch(authCheckState()),
  };
};

export default  connect(mapStateToProps, mapDispatchToProps)(App)
