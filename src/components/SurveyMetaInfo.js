import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Container,
  Grid,
  Segment,
  List,
  Loader,
  Item,
  Header,
} from "semantic-ui-react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";

function SurveyMetaInfo(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [questionsData, setQuestionsData] = useState([]);

  useEffect(() => {
    const getUserSurveys = () => {
      const surveyID = props.match.params.surveyID;
      axios
        .get(`http://127.0.0.1:5000/form-data?survey=${surveyID}`)
        .then((res) => {
          setQuestionsData(res.data.result);
          setIsLoading(false);
          console.log(res.data.result);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getUserSurveys();
  }, []);
  return (
    <Container style={styles.mainContainer}>
      <Header></Header>
      <Grid>
        <Grid.Row columns={2}>
          {isLoading === true ? (
            <Container style={{ padding: "10rem" }}>
              <Loader active size="massive" />
            </Container>
          ) : (
            questionsData.map((item) => {
              return (
                <Grid.Column style={styles.singleCol}>
                  <Segment>
                    <h3 style={{ color: "teal" }}>{item.question}</h3>
                    <Doughnut
                      height={150}
                      width={350}
                      data={{
                        labels: item.answers.map((ans) => ans.val),
                        datasets: [
                          {
                            data: item.answers.map((ans) => ans.times),
                            backgroundColor: [
                              "#FF6384",
                              "#36A2EB",
                              "#FFCE56",
                              "MediumSeaGreen",
                              "LightGray",
                            ],
                            hoverBackgroundColor: [
                              "#FF6384",
                              "#36A2EB",
                              "#FFCE56",
                              "MediumSeaGreen",
                              "LightGray",
                            ],
                          },
                        ],
                      }}
                    />
                  </Segment>
                </Grid.Column>
              );
            })
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
}

const styles = {
  mainContainer: {
    padding: "3rem",
    margin: "3rem",
    minHeight: "72vh",
  },
  singleCol: {
    marginTop: "1rem",
    marginBottom: "1rem",
    fontFamily: "monospace",
  },
};
const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    currentLoggedUser: state.auth.currentLoggedUser,
  };
};

export default connect(mapStateToProps)(SurveyMetaInfo);
