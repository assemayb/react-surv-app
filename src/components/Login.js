import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Container,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { authLogin } from "../store/actions/auth";
import { Redirect } from "react-router-dom";

const LoginForm = ({ token, login, error, history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const loginUser = () => {
    if (username && password) {
      login(username, password);
    } else {
      setErr("Enter Valid Data");
      setTimeout(() => {
        setErr("");
      }, 2000);
    }
  };
  return (
    <Container>
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header
            as="h3"
            color="blue"
            textAlign="center"
            style={{ marginBottom: "2rem" }}
          >
            <Segment>Login to your account</Segment>
          </Header>
          <Form size="big" inverted onSubmit={loginUser}>
            {err && <h6>{err}</h6>}
            <Segment>
              <Form.Input
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="username"
              />
              <Form.Input
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />

              <Button color="blue" fluid size="small">
                Login
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(authLogin(username, password)),
  };
};
export default connect(null, mapDispatchToProps)(LoginForm);
