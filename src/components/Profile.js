import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Grid,
  Segment,
  Form,
  Button,
  Message,
  Icon,
  List,
  Card,
  Header,
  Divider,
} from "semantic-ui-react";
import axios from "axios";
import { connect } from "react-redux";

function Profile({ currentLoggedUser }) {
  const [newSurveyTheme, setNewSurveyTheme] = useState("");
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const getUserSurveys = () => {
      const user = currentLoggedUser;
      axios
        .get(`http://127.0.0.1:5000/user-surveys?username=${user}`)
        .then((res) => {
          setTimeout(() => {
            console.log(res.data);
            setSurveys(res.data);
          }, 300);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getUserSurveys();
  }, [dataSubmitted, setDataSubmitted]);

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
      <Grid stackable>
        <Grid.Row columns={3}>
          <Grid.Column width={6}>
            <Container style={styles.col}>
              <Segment style={styles.colSegment}>
                <h2>Manage Your Surveys</h2>
                <Divider />
                <List>
                  {surveys.map((sur, index) => {
                    return (
                      <List.Item key={index}>
                        <Card
                          style={styles.card}
                          href="#card-example-link-card"
                        >
                          <Card.Content>{sur.theme}</Card.Content>
                        </Card>
                      </List.Item>
                    );
                  })}
                </List>
              </Segment>
            </Container>
          </Grid.Column>
          <Grid.Column width={5}>
            <Container style={styles.col}>
              <Segment
                style={{
                  color: "cadetblue",
                  boxShadow: styles.colSegment.boxShadow,
                }}
              >
                {dataSubmitted && (
                  <Icon name="circle notched" loading size="big" />
                )}
                {!dataSubmitted && <h2>Create A new One</h2>}
              </Segment>
              <Segment style={styles.colSegment}>
                <Form style={{ padding: "0.4rem" }} onSubmit={createNewSurvey}>
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
          <Grid.Column width={5}>
            <Container style={styles.col}>
              <Segment style={styles.colSegment}>
                <h3>Data</h3>
              </Segment>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

const styles = {
  mainContainer: {
    padding: "2rem",
    margin: "3rem",
    minHeight: "70vh",
  },
  col: {
    padding: "2rem",
  },
  colSegment: {
    color: "dodgerBlue",
  },
  card: {
    backgroundColor: "#0c6db2",
    color: "white",
    textAlign: "center",
    fontSize: "1.2rem",
    margin: "0.2rem",
  },
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    currentLoggedUser: state.auth.currentLoggedUser,
  };
};

export default connect(mapStateToProps)(Profile);
