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
  Loader,
} from "semantic-ui-react";
import axios from "axios";
import { connect } from "react-redux";

function Profile({ currentLoggedUser, history }) {
  const [newSurveyTheme, setNewSurveyTheme] = useState("");
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserSurveys = () => {
      const user = currentLoggedUser;
      axios
        .get(`http://127.0.0.1:5000/user-surveys?username=${user}`)
        .then((res) => {
          setTimeout(() => {
            setIsLoading(false);
            setSurveys(res.data);
            console.log(res.data);
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
  const enterSurvey = (id) => {
    const cardHref = `/survey-info/${id}`;
    history.push(cardHref);
    // /survey-info/:surveyID
  };
  return (
    <Container style={styles.mainContainer}>
      <Grid stackable>
        <Grid.Row columns={3}>
          <Grid.Column width={4}>
            <Segment>
              <h2 style={{ color: "cornflowerblue" }}>Surveys Info.</h2>
            </Segment>
            <Segment style={styles.colSegment}>
              {isLoading && (
                <Container style={{ marginTop: "14rem" }}>
                  <Loader active size="big" />
                </Container>
              )}
              <List>
                {surveys.map((sur, index) => {
                  return (
                    <Container>
                      <List.Item key={index}>
                        <Container
                          style={styles.card}
                          onClick={() => enterSurvey(sur.id)}
                        >
                          <Button animated style={styles.btn1}>
                            <Button.Content visible>{sur.theme}</Button.Content>
                            <Button.Content hidden>
                              <h4>{sur.questions_num} questions</h4>
                            </Button.Content>
                          </Button>
                        </Container>
                      </List.Item>
                    </Container>
                  );
                })}
              </List>
            </Segment>
          </Grid.Column>

          <Grid.Column width={8}>
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
              <Segment>
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
          <Grid.Column width={4}>
            <Segment>
              <h3 style={{ color: "cadetblue" }}>Number of Participants</h3>
            </Segment>
            <Segment style={styles.colSegment}>
              {isLoading && (
                <Container style={{ marginTop: "14rem" }}>
                  <Loader active size="big" />
                </Container>
              )}
              <List>
                {surveys.map((sur, index) => {
                  return (
                    <Container>
                      <List.Item key={index}>
                        <Container
                          style={styles.card}
                          // onClick={() => enterSurvey(sur.id)}
                        >
                          <Button animated style={styles.btn2}>
                            <Button.Content visible>{sur.theme}</Button.Content>
                            <Button.Content hidden>
                              <h4>{sur.submitted_surv_num} participants</h4>
                            </Button.Content>
                          </Button>
                        </Container>
                      </List.Item>
                    </Container>
                  );
                })}
              </List>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

const styles = {
  mainContainer: {
    padding: "3rem",
    margin: "4rem",
    minHeight: "70vh",
  },
  colSegment: {
    color: "dodgerBlue",
    justifyContent: "center",
    padding: "0.3rem",
  },
  card: {
    color: "dodgerblue",
    margin: "auto",
    fontSize: "1.5em",
    borderRadius: "30px",
  },
  btn1: {
    backgroundColor: "cornflowerblue",
    color: "white",
    fontSize: "1.5rem",
    padding: "2.5rem",
    margin: "10px auto",
    zIndex: "0",
  },
  btn2: {
    backgroundColor: "cadetBlue",
    color: "white",
    fontSize: "1.5rem",
    margin: "10px auto",
    padding: "2.5rem",
    zIndex: "0",

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
