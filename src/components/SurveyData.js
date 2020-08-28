import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  Segment,
  Container,
  Form,
  Radio,
  Loader,
  Button,
  Divider,
} from "semantic-ui-react";

function SurveyData(props) {

  const [isChecking, setIsChecking] = useState(true);
  const [isUserAllowed, setIsUserAllowed] = useState(false);
  
  const surveyID = props.match.params.surveyID;

  useEffect(() => {
    const checkUser = () => {
      axios
        .get(`http://127.0.0.1:5000/check-user?survey=${surveyID}`)
        .then((res) => {
          if (res.status.toString() === "200") {
            setIsChecking(false);
            setIsUserAllowed(true);
          } else {
            console.log("bzzbzbzbzzb");
            setIsUserAllowed(false);
            setIsChecking(false);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };
    checkUser();
  }, []);
  const [surveyData, setSurveyData] = useState({
    title: "",
    creator: 0,
    questions: [],
  });
  const [submittedData, setSubmittedData] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ isUserSurveyCreator, setIsUserSurveyCreator ] = useState(false)

  // console.log(props.history)
  useEffect(() => {
    const surveyId = props.match.params.surveyID;
    const { isAuthenticated, currentLoggedUser } = props;

    const getSurveyData = () => {
      axios
        .get(`http://127.0.0.1:5000/survey?id=${surveyId}`)
        .then((res) => {
          console.log(res.data);
          setSurveyData(res.data); 
          const creatorName = res.data.creator_name 
          if (isAuthenticated){
            currentLoggedUser === creatorName && (
              setIsUserSurveyCreator(true)
            )
          } 
          if (res.data.length >= 1) {
            setLoading((prev) => !prev);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getSurveyData();
  }, []);

  const handleChange = (questionId, quesVal, ansId, ansVal) => {
    const singleAns = {
      questionId,
      quesVal,
      ansId,
      ansVal,
    };
    const isSubmitted = answeredQuestions.includes(quesVal);
    let subData = submittedData;
    if (!isSubmitted) {
      let subQ = answeredQuestions;
      subQ.push(quesVal);
      setAnsweredQuestions(subQ);
      subData.push(singleAns);
    } else {
      const ansIndex = submittedData.findIndex(
        (elem) => elem.quesVal === quesVal && elem.questionId === questionId
      );
      subData[ansIndex] = singleAns;
    }
    setSubmittedData(subData);
  };

  const submitSurvey = () => {
    const allQuestionsNum = surveyData.questions.length;
    const submittedQuestionsNum = answeredQuestions.length;
    const allQuestAnswered = allQuestionsNum == submittedQuestionsNum;
    if (allQuestAnswered) {
      console.log(surveyData);
      axios
        .post(`http://127.0.0.1:5000/submit-form?survey=${surveyID}`, {
          // title: surveyData.title,
          submittedData,
        })
        .then((res) => {
          console.log(submittedData);
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    } else {
      setError((prevState) => !prevState);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setError((prevState) => !prevState);
      }, 2000);

      console.log("NOPEE");
    }
  };
  return (
    <>
      {!isChecking ? (
        <Container style={styles.mainContainer}>
          <>
            {surveyData.questions.length >= 1 ? (
              <>
                {isUserAllowed ? (
                  <div>
                    <Container>
                      {error == true ? (
                        <div style={{ color: 'red', fontSize: '25px'}} >Answer All Questions!</div>
                      ) : (
                        <div style={styles.header}>
                          {surveyData.title} survey
                        </div>
                      )}
                    </Container>
                    <Segment style={styles.questSection}>
                      {surveyData.questions.map((q, ind) => {
                        return (
                          <Container key={ind}>
                            <Segment style={styles.ansSection}>
                              <Form key={q.id}>
                                <h2> {q.question_title} </h2>
                                {q.answers.map((ans, index) => {
                                  return (
                                    <Container
                                      key={index}
                                      style={{ padding: "1rem" }}
                                    >
                                      <Form.Field>
                                        <Radio
                                          label={ans.answer_value}
                                          style={{ fontSize: "15px" }}
                                          name={q.question_title}
                                          id={ans.answer_id + ans.answer_value}
                                          value={ans.answer_value}
                                          onClick={(e) =>
                                            handleChange(
                                              q.id,
                                              q.question_title,
                                              ans.answer_id,
                                              ans.answer_value
                                            )
                                          }
                                          // onChange={(e) => console.log(e)}
                                        />
                                      </Form.Field>
                                    </Container>
                                  );
                                })}
                              </Form>
                            </Segment>
                          </Container>
                        );
                      })}
                    </Segment>

                    <Button
                      style={{ padding: "2rem", fontSize: "20px" }}
                      color="blue"
                      onClick={submitSurvey}
                    >
                      SUBMIT
                    </Button>
                  </div>
                ) : (
                  <div
                    style={{
                      height: "53vh",
                      padding: "10rem",
                      margin: "4rem",
                    }}
                  >
                    <Segment>
                      <div style={{ padding: "2rem" }}>
                        <h1>You Have Already Submitted This Form.</h1>
                      </div>
                    </Segment>
                  </div>
                )}
              </>
            ) : (
              <>
                <Container style={{ height: "37rem" }}>
                  {loading ? (
                    <Loader active size="big" />
                  ) : (
                    <h1>such empty!</h1>
                  )}
                </Container>
              </>
            )}
          </>
        </Container>
      ) : (
        <div style={{ height: "64vh", padding: "10rem", margin: "4rem" }}>
          <Loader active size="big" />
        </div>
      )}
    </>
  );
}

const styles = {
  mainContainer: {
    margin: "2rem",
    padding: "1rem",
    color: "teal",
  },
  header: {
    fontSize: "50px",
    margin: "1rem",
    padding: "1rem",
    marginBottom: "3rem",
    borderRadius: "20px",
    color: "#2185D0",
  },
  questSection: {
    border: "1px solid dodgerBlue",
    margin: "3rem",
    padding: "2rem",
  },
  ansSection: {
    margin: "2rem",
    border: "1px solid dodgerBlue",
    padding: "2rem",
    boxShadow: "3px 3px 6px 2px rgba(0,0,0,0.39)",
    backgroundColor: "#f7f7f7",
  },
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    currentLoggedUser: state.auth.currentLoggedUser,
  };
};

export default connect(mapStateToProps)(SurveyData);
