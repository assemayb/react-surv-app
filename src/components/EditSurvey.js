import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Container,
  Segment,
  TextArea,
  Input,
  Divider,
  Form,
  Button,
  Loader,
} from "semantic-ui-react";
import axios from "axios";

function EditSurvey(props) {
  const id = props.match.params.surveyID;
  const currentLoggedUser = props.currentLoggedUser;
  const [surveyData, setSurveyData] = useState({
    // title: "",
    // creator: 0,
    questions: [],
  });
  const [dataToSubmit, setDataToSubmit] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const surveyId = props.match.params.surveyID;
    const { isAuthenticated, currentLoggedUser } = props;

    const getSurveyData = () => {
      axios
        .get(`http://127.0.0.1:5000/survey?id=${surveyId}`)
        .then((res) => {
          setSurveyData(res.data);
          setIsLoading(false);
          console.log(res.data.questions);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getSurveyData();
  }, []);

  const changeQuestion = (quesID, quesDefaultVal, quesNewVal) => {
    let dataArr = surveyData.questions;
    dataArr[quesID - 1].question_title = quesNewVal;
    setDataToSubmit(dataArr);
  };

  const changeAnswer = (ansID, ansDefaultVal, ansNewVal, quesID) => {
    let dataArr = surveyData.questions;
    let answers = dataArr[quesID - 1].answers;
    answers[ansID].answer_value = ansNewVal;
    setDataToSubmit(dataArr);
  };
  const submitChanges = () => {
    const dataChanges = dataToSubmit;
    if (dataChanges.length === 0) {
      console.log("احا يا عم");
    } else {
      console.log(dataChanges);
    }
  };
  return (
    <Container style={styles.mainContainer}>
      <Segment>
        <>
          {isLoading && (
            <Container style={{ height: "30vh" }}>
              <Loader active size="big" />
            </Container>
          )}
          <>{surveyData.questions.length === 0 && <h1>No data</h1>}</>

          {surveyData.questions.map((q) => {
            return (
              <Segment style={styles.questionSeg}>
                <Container>
                  <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ color: "teal" }}>question title</h3>
                    <Input
                      style={{ minWidth: "50vw" }}
                      placeholder={q.question_title}
                      name={q.question_title}
                      defaultValue={q.question_title}
                      onChange={(e) =>
                        changeQuestion(
                          q.id,
                          e.target.defaultValue,
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <h3 style={{ color: "teal" }}>question answers</h3>
                    {q.answers.map((ans, index) => {
                      return (
                        <Input
                          style={{ minWidth: "50vw" }}
                          name={ans.answer_value}
                          defaultValue={ans.answer_value}
                          onChange={(e) =>
                            changeAnswer(
                              index,
                              e.target.defaultValue,
                              e.target.value,
                              q.id
                            )
                          }
                        />
                      );
                    })}
                  </div>
                </Container>
              </Segment>
            );
          })}
        </>
      </Segment>
      {surveyData.questions.length >= 1 && (
        <Button color="blue" style={{ height: "50px" }} onClick={submitChanges}>
          {" "}
          submit changes
        </Button>
      )}
    </Container>
  );
}

export const styles = {
  mainContainer: {
    margin: "5rem",
    minHeight: "70vh",
    padding: "1rem",
    textAlign: "center",
  },
  questionSeg: {
    margin: "2rem",
    paddingTop: "3rem",
    paddingBottom: "3rem",
    textAlign: "center",
    borderRadius: "20px",
    boxShadow: "3px 3px 6px 2px rgba(0,0,0,0.39)",
  },
};

const mapStateToProps = (state) => {
  return {
    // token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    currentLoggedUser: state.auth.currentLoggedUser,
  };
};

export default connect(mapStateToProps)(EditSurvey);
