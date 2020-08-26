import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Message,
  Header,
  Segment,
  Form,
  Button,
  Loader,
  Dropdown,
  Label,
  Icon,
} from "semantic-ui-react";
import axios from "axios";
import { connect } from "react-redux";

const SuccessMessage = ({ status }) => {
  if (status === "200") {
    return (
      <Message
        style={{ padding: "2rem" }}
        color="green"
        header="Data is submitted successfully"
      />
    );
  } else {
    return (
      <Message
        style={{ padding: "2rem" }}
        color="red"
        header="This Question has been added before!"
      />
    );
  }
};
function SurvForm({ setDataSubmitted, currentLoggedUser }) {
  const [userSurveys, setUserSurveys] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionAns, setNewQuesionAns] = useState(["ans one"]);
  const [options, setOptions] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState({
    state: false,
    responseStatus: null,
  });
  useEffect(() => {
    const getSurv = () => {
      axios
        .get(`http://127.0.0.1:5000/user-surveys?username=${currentLoggedUser}`)
        .then((res) => {
          let resData = res.data;
          setUserSurveys(resData);
          let dropdownOptions = [];
          for (let sur in resData) {
            const themeObj = {
              key: sur,
              text: resData[sur].theme,
              value: sur,
            };
            dropdownOptions.push(themeObj);
          }
          setOptions(dropdownOptions);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getSurv();
  }, []);

  const increaseAnsArr = () => {
    let ans = newQuestionAns;
    ans.push("another answer");
    setNewQuesionAns(ans);
    setDataChanged((prev) => !prev);
  };

  function handleAddAns(itemInex, ansVal) {
    let questionAns = newQuestionAns;
    questionAns[itemInex] = ansVal;
    setNewQuesionAns(questionAns);
  }
  function submitNewQuestion() {
    const el = document.getElementById("survThemeElement");
    const surveyTheme = el && el.innerText;
    let newQuestionAnswers = [];
    newQuestionAns.forEach((ans) => {
      newQuestionAnswers.push(ans);
    });
    const isEnoughAns = newQuestionAnswers.length >= 3;
    if (newQuestion && surveyTheme && isEnoughAns && newQuestion !== "") {
      const themeID = userSurveys.find((sur) => sur.theme === surveyTheme).id;
      const isSubState = isSubmitted.state;
      axios
        .post(`http://127.0.0.1:5000/survey?id=${themeID}`, {
          title: newQuestion,
          answers: newQuestionAns,
        })
        .then((res) => {
          setIsSubmitted({
            ...isSubmitted,
            state: !isSubState,
            responseStatus: res.status.toString(),
          });
          setTimeout(() => {
            setDataSubmitted((prevState) => !prevState);
          }, 1500);
        })
        .catch((err) => {
          setIsSubmitted({
            ...isSubmitted,
            state: !isSubState,
            responseStatus: err.response.status.toString(),
          });
        });
    }
  }

  return (
    <Container style={styles.mainContainer}>
      <Segment style={{ padding: "2rem" }}>
        {isSubmitted.responseStatus === null ? (
          <h2 style={{ color: "#2185D0" }}>Add Questions To Your Surveys</h2>
        ) : (
          <SuccessMessage status={isSubmitted.responseStatus} />
        )}
      </Segment>
      <Segment style={{ padding: "1.5rem" }}>
        <Grid.Column width={5}>
          <Container
            style={{ textAlign: "center", color: "blue", width: "800px" }}
          >
            <Form>
              <Form.Field>
                <h3 style={{ margin: "1rem", color: "teal" }}>Survey Title</h3>
                <Dropdown
                  id="survThemeElement"
                  placeholder="choose survey theme"
                  clearable
                  options={options}
                  fluid
                  selection
                />
              </Form.Field>

              <Form.Field>
                <h3 style={{ margin: "1rem", color: "teal" }}>
                  Add A Question
                </h3>

                <input
                  placeholder="enter a question.."
                  name="question"
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </Form.Field>
              <Form.Group widths="equal">
                {newQuestionAns &&
                  newQuestionAns.map((ans, index) => {
                    return (
                      <Form.Field key={ans.id}>
                        <input
                          placeholder={newQuestionAns[index]}
                          name="answer"
                          onChange={(e) => handleAddAns(index, e.target.value)}
                        />
                      </Form.Field>
                    );
                  })}
              </Form.Group>
              <Button.Group>
                <Button
                  color="facebook"
                  floated="left"
                  compact
                  type="submit"
                  onClick={submitNewQuestion}
                >
                  create
                </Button>
                <Button
                  floated="right"
                  compact
                  onClick={increaseAnsArr}
                  style={{ marginLeft: "8px" }}
                >
                  add ans
                </Button>
              </Button.Group>
            </Form>
          </Container>
        </Grid.Column>
      </Segment>
    </Container>
  );
}

const styles = {
  mainContainer: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    currentLoggedUser: state.auth.currentLoggedUser,
  };
};

export default connect(mapStateToProps)(SurvForm);
