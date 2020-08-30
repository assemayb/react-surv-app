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
import SurveyData from "./SurveyData";

function EditSurvey(props) {
  const surveyId = props.match.params.surveyID;
  const currentLoggedUser = props.currentLoggedUser;

  const [surveyData, setSurveyData] = useState({
    questions: [],
  });
  const [dataToSubmit, setDataToSubmit] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [changedQuestionsIDs] = useState([]);
  const [message, setMessage] = useState({available: false, value: ""})

  useEffect(() => {
    const surveyId = props.match.params.surveyID;
    const { isAuthenticated, currentLoggedUser } = props;

    const getSurveyData = () => {
      axios
        .get(`http://127.0.0.1:5000/survey?id=${surveyId}`)
        .then((res) => {
          setSurveyData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getSurveyData();
  }, []);

  const changeQuestion = (quesIndex, quesDefaultVal, quesNewVal) => {
    let dataArr = [...surveyData.questions]
    const questionID = surveyData.questions[quesIndex].id;
    dataArr[quesIndex].question_title = quesNewVal;
    if (!changedQuestionsIDs.includes(questionID)) {
      changedQuestionsIDs.push(questionID);
    }
    setDataToSubmit(dataArr);
  };

  const changeAnswer = (ansIndex, ansDefaultVal, ansNewVal, quesIndex) => {
    let dataArr = [...surveyData.questions]
    let answers = dataArr[quesIndex].answers;
    const questionID = surveyData.questions[quesIndex].id;
    answers[ansIndex].answer_value = ansNewVal;
    if (!changedQuestionsIDs.includes(questionID)) {
      changedQuestionsIDs.push(questionID);
    }
    setDataToSubmit(dataArr);
  };
  const submitChanges = () => {
    if (dataToSubmit.length === 0) {
      console.error("No changes !!");
    } else {
      console.log(dataToSubmit, changedQuestionsIDs)
      axios
        .post(`http://127.0.0.1:5000/survey-update?id=${surveyId}`, {
          dataToSubmit,
          changedQuestionsIDs,
        })
        .then((res) => {
          if(res.status.toString() === "200"){
            window.scrollTo(0, 10)
            setMessage({ ...message , available: true, value: 'Change has been submitted.'})
            setTimeout(() => {
              setMessage({...message, available: false})
            }, 1500)
          } 
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    }
  };
  return (
    <Container style={styles.mainContainer}>
      {message.available === true && (
        <Container style={{height: '10vh'}}>
          <h1>{message.value}</h1>
        </Container>
      )}
      <Segment>
        <>
          {isLoading && (
            <Container style={{ height: "30vh" }}>
              <Loader active size="big" />
            </Container>
          )}
          <>{surveyData.questions.length === 0 && <h1>No data</h1>}</>

          {surveyData.questions.map((q, qIndex) => {
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
                          qIndex,
                          e.target.defaultValue,
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <h3 style={{ color: "teal" }}>question answers</h3>
                    {q.answers.map((ans, ansIndex) => {
                      return (
                        <Input
                          style={{ minWidth: "50vw" }}
                          name={ans.answer_value}
                          defaultValue={ans.answer_value}
                          onChange={(e) =>
                            changeAnswer(
                              ansIndex,
                              e.target.defaultValue,
                              e.target.value,
                              qIndex
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
