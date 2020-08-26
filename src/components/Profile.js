import React, { useState, useRef } from "react";
import {
  Container,
  Grid,
  Segment,
  Form,
  Button,
  Message,
  Icon,
} from "semantic-ui-react";
import axios from "axios";
import { connect } from "react-redux";

function Profile({ currentLoggedUser }) {
  const [newSurveyTheme, setNewSurveyTheme] = useState("");
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const createNewSurvey = () => {
    const surTheme = newSurveyTheme;
    if (newSurveyTheme) {
      axios
        .post("http://127.0.0.1:5000/surveys", {
          theme: surTheme,
          username: currentLoggedUser,
        })
        .then((res) => {
          if (res.data.msg === "Survey Created!") {
            setDataSubmitted((prev) => !prev);
            setTimeout(() => {
              setDataSubmitted((prev) => !prev);
            }, 1000);
          }
        })
        .catch((err) => console.error(err));
    } else {
      console.log("nothing to add");
    }
  };
  return (
    <Container style={styles.mainContainer}>
      <Grid>
        <Grid.Row columns={3}>
          <Grid.Column width={3}>
            <Segment style={styles.col}>
              <h1>First</h1>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Container style={styles.col}>
              <Segment style={{ color: "cadetblue" }}>
                {dataSubmitted && (
                  <Icon name="circle notched" loading size="big" />
                )}
                {!dataSubmitted && <h1>Create A new Survey</h1>}
              </Segment>
              <Segment>
                <Form style={{ padding: "2rem" }} onSubmit={createNewSurvey}>
                  <Form.Field>
                    <h3 style={{ color: "cadetblue" }}> Survey Theme</h3>
                    <input
                      placeholder="enter a title..."
                      name="title"
                      onChange={(e) => setNewSurveyTheme(e.target.value)}
                    />
                  </Form.Field>
                  <Button fluid color="blue" type="submit">
                    create survey
                  </Button>
                </Form>
              </Segment>
            </Container>
          </Grid.Column>
          <Grid.Column width={3} >
            <Segment style={styles.col}>
              <h1>Third</h1>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

const styles = {
  mainContainer: {
    padding: "4rem",
    margin: "5rem",
  },
  col: { padding: "2rem" },
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    currentLoggedUser: state.auth.currentLoggedUser,
  };
};

export default connect(mapStateToProps)(Profile);
