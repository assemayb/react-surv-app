import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container, Grid, Segment } from "semantic-ui-react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";

function SurveyMetaInfo(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);

  console.log(props.match.params.surveyID);
  useEffect(() => {
    const getUserSurveys = () => {
      const user = props.currentLoggedUser;
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
  }, []);
  const data = {
    labels: ["Red", "Yellow", "Blue"],
    datasets: [
      {
        data: [20, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <Container style={styles.mainContainer}>
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment>
              <h3>question title</h3>
              <Doughnut height={100} data={data} />
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <h3>question title</h3>
              <Doughnut height={100} data={data} />
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
};
const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    currentLoggedUser: state.auth.currentLoggedUser,
  };
};

export default connect(mapStateToProps)(SurveyMetaInfo);
