import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Loader,
  Dimmer,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authSignUp } from "../store/actions/auth";

const RegistrationForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = props.token;
  const signupSubmit = () => {
    if (username && password && email) {
      props.signup(username, password, email);
      const msg = localStorage.getItem("msg");
      const status = localStorage.getItem("status");

      if (status === "403") {
        setMessage(msg);
      } else if (status === "201") {
        setLoading(true);
        setMessage(msg);
        setTimeout(() => {
          props.history.push("/login");
        }, 2000);
      }
      localStorage.removeItem("msg");
      localStorage.removeItem("status");
    } else {
      setMessage("Invalid data");
    }
  };

  return (
    <Grid textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        {loading && <Loader active />}
        {message && <h4>{message}</h4>}
        <React.Fragment>
          <Form size="big" inverted onSubmit={signupSubmit}>
            <Segment>
              <Form.Input
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Username"
              />
              <Form.Input
                onChange={(e) => setPassword(e.target.value)}
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />
              <Form.Input
                onChange={(e) => setEmail(e.target.value)}
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="E-mail"
                type="text"
              />

              <Button color="blue" fluid size="small">
                Sign Up
              </Button>
            </Segment>
          </Form>
        </React.Fragment>
      </Grid.Column>
    </Grid>
  );
};


const mapDispatchToProps = dispatch => {
  return {
    signup: (username, password, email) => dispatch(authSignUp(username, password, email))
  }
}
export default connect(null, mapDispatchToProps)(RegistrationForm);
