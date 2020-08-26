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
  const [isChecking, setIsChecking] = useState(false) 
  const [isUserAllowed, setIsUserAllowed] = useState(false);
  useEffect(() => {
    const checkUser = () => {
      axios
        .get("http://127.0.0.1:5000/check-user")
        .then((res) => {
          console.log(res.data);
          setIsChecking(true)
          if (res.status == "200"){
          }
        })
        .catch((err) => console.error(err));
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

  useEffect(() => {
    const surveyId = props.match.params.surveyID;
    const getSurveyData = () => {
      axios
        .get(`http://127.0.0.1:5000/survey?id=${surveyId}`)
        .then((res) => {
          setTimeout(() => {
            setSurveyData(res.data);
          }, 300);
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
        .post("http://127.0.0.1:5000/submit-form", { submittedData })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    } else {
      setError((prevState) => !prevState);
      window.scrollTo(0, 50);
      setTimeout(() => {
        setError((prevState) => !prevState);
      }, 2000);

      console.log("NOPEE");
    }
  };
  return (
    <>
    {/* {!isUserAllowed && (
       <div style={{height: '20vh', padding: '10rem', margin: '4rem'}}>
       <h1>Waiting for data.......</h1>
     </div>
    )} */}
    { isChecking ? (<Container style={styles.mainContainer}>
      {surveyData.questions.length !== 0 ? (
        <>
          <Container>
            {error == true ? (
              <div style={styles.header}>Answer All Questions.</div>
            ) : (
              <div style={styles.header}>{surveyData.title} survey</div>
            )}
            <Divider />
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
                          <Container key={index} style={{ padding: "1rem" }}>
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
          <Divider />
          <Button
            style={{ padding: "2rem", fontSize: "20px" }}
            color="blue"
            onClick={submitSurvey}
          >
            submit survey
          </Button>
        </>
      ) : (
        <Container style={{ height: "40rem" }}>
          <Loader active size="big" />
        </Container>
      )}
    </Container>)
    : (
      <div style={{height: '20vh', padding: '10rem', margin: '4rem'}}>
        <h1>Waiting for data.......</h1>
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
    margin: "2rem",
    borderRadius: "20px",
  },
  ansSection: {
    margin: "30px",
    borderRadius: "20px",
    padding: "2rem",
    backgroundColor: "#f7f7f7",
  },
};

export default connect()(SurveyData);
