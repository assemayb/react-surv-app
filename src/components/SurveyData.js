import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  Segment,
  Container,
  Form,
  Radio,
  Label,
  Header,
  Loader,
  Dimmer,
  Image,
  Button,
  Divider
} from "semantic-ui-react";

function SurveyData(props) {
  const [surveyData, setSurveyData] = useState({
    title: "",
    creator: 0,
    questions: [],
  });
  const [submittedData, setSubmittedData] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  useEffect(() => {
    const surveyId = props.match.params.surveyID;
    const getSurveyData = () => {
      axios
        .get(`http://127.0.0.1:5000/survey?id=${surveyId}`)
        .then((res) => {
          console.log(res.data);
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
    console.log(isSubmitted);
    if (!isSubmitted) {
      let subQ = answeredQuestions;
      subQ.push(quesVal);
      setAnsweredQuestions(subQ);
      let subData = submittedData;
      subData.push(singleAns);
      setSubmittedData(subData);
    } else {
      const ansIndex = submittedData.findIndex(
        (elem) => elem.quesVal === quesVal && elem.questionId === questionId
      );
      console.log(ansIndex)
      let subData = submittedData;
      subData[ansIndex] = singleAns;
      setSubmittedData(subData);
    }
    console.log(submittedData);
  };
  return (
    <Container style={styles.mainContainer}>
      {surveyData.questions.length !== 0 ? (
        <>
          <Container>
            <div style={styles.header}>{surveyData.title} survey</div>
            <Divider />
          </Container>
          <Segment style={styles.questSection}>
            {surveyData.questions.map((q) => {
              return (
                <Container>
                  <Segment style={styles.ansSection}>
                    <Form key={q.id}>
                      <h2> {q.question_title} </h2>
                      {q.answers.map((ans, index) => {
                        return (
                          <Container style={{ padding: "1rem" }}>
                            <Form.Field key={index}>
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
                                    ans.answer_value,
                                    ans.answer_id
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
          <Button  style={{padding: '2rem', fontSize: '20px'}}color="blue" > submit survey</Button>
        </>
      ) : (
        <Container style={{ height: "40rem" }}>
          <Loader active size="big" />
        </Container>
      )}
    </Container>
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
