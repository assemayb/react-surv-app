import React, { useState, useEffect } from "react";
import {
  Container,
  Segment,
  Grid,
  Button,
  Icon,
  Loader,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import LoginForm from "./Login";
import RegistrationForm from "./Signup";
import SurvForm from "./SurvForm";

function MainLayout({ isAuthenticated }) {
  const [login, setLogin] = useState(true);
  const [signup, setSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReloaded, setIsReloaded] = useState(false);
  const [dataSubmitted, setDataSubmitted] = useState(false);

  useEffect(() => {
    const reloadForm = () => {
      setIsReloaded(true);
      setTimeout(() => {
        setIsReloaded(false);
      }, 500);
    };
    reloadForm()
  }, [dataSubmitted, setDataSubmitted]);

  const toggleSignUpForm = () => {
    setLogin((prevState) => !prevState);
    setSignUp((prevState) => !prevState);
  };
  if (isAuthenticated) {
    return (
      <Container style={styles.mainContainer}>
        {isReloaded ? (
          <Container style={{ padding: "10rem", height: '69vh' }}>
            <Loader active size="large"/>
          </Container>
        ) : (
          <SurvForm setDataSubmitted={setDataSubmitted} />
        )}
      </Container>
    );
  } else {
    return (
      <div style={styles.mainContainer}>
        <Container style={styles.innerContainer}>
          {login && <LoginForm />}
          {signup && <RegistrationForm />}
        </Container>
        <div style={styles.toggleButton}>
          <Link as="h1" loading={isLoading} onClick={() => toggleSignUpForm()}>
            {login ? "create a new account " : "login to your account "}
          </Link>
        </div>
      </div>
    );
  }
}
const styles = {
  mainContainer: {
    padding: "4rem",
  },
  innerContainer: {
    padding: "1rem",
    height: '54vh'
  },
  toggleButton: {
    textAlign: "center",
    marginTop: "3rem",
    marginBottom: "2rem",
  },
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token != null,
  };
};
export default connect(mapStateToProps)(MainLayout);
