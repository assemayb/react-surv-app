import React, { useEffect, useState } from "react";
import {
  Container,
  List,
  Loader,
  Segment,
  Button,
  Popup,
  Icon,
} from "semantic-ui-react";
import axios from "axios";
import { connect } from "react-redux";
import SurveyCardItem from "./SurveyCard";

const ListExampleCelled = ({ surveys, history, setDataChaned, user }) => {
  const handleDelete = (surveyId) => {
    axios
      .delete(
        `http://127.0.0.1:5000/survey-delete?id=${surveyId}&username=${user}`
      )
      .then((res) => {
        setDataChaned((prev) => !prev);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleNoDelete = (surveyId) => {
    console.log("no delete");
    document.getElementById(`delete-button-${surveyId}`).click();
  };
  const editSurvey = (surveyId) => {
    console.log("edit survey", surveyId);
  };
  return (
    <List
      horizontal
      size="large"
      style={{ margin: "0.5rem", padding: "0.5rem" }}
    >
      {surveys.map((sur) => {
        return (
          <List.Item style={{ margin: "1rem", padding: "2rem" }}>
            <SurveyCardItem raised surveyData={sur} history={history} />
            <Popup
              style={{ borderRadius: "20px" }}
              content="I will not flip!"
              on="click"
              pinned
              position="bottom right"
              trigger={
                <Button
                  id={`delete-button-${sur.id}`}
                  style={styles.smallButton}
                  icon="trash"
                  color="google plus"
                />
              }
            >
              <div>
                <h3>are you sure?</h3>
                <Button
                  style={styles.smallButton}
                  color="youtube"
                  onClick={() => handleDelete(sur.id)}
                >
                  yes
                </Button>
                <Button
                  style={styles.smallButton}
                  color="green"
                  onClick={() => handleNoDelete(sur.id)}
                >
                  no
                </Button>
              </div>
            </Popup>
            <Button
              style={styles.smallButton}
              icon="edit"
              color="grey"
              onClick={() => editSurvey(sur.id)}
            />
          </List.Item>
        );
      })}
    </List>
  );
};

function Survey(props) {
  const [data, setData] = useState([]);
  const [dataChanged, setDataChaned] = useState(false);
  const currentLoggedUser = props.currentLoggedUser;

  useEffect(() => {
    const getUserSurv = () => {
      const user = props.currentLoggedUser;
      axios
        .get(`http://127.0.0.1:5000/user-surveys?username=${user}`)
        .then((res) => {
          setTimeout(() => {
            setData(res.data);
          }, 300);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getUserSurv();
  }, [dataChanged, setDataChaned]);

  return (
    <>
      <Container style={{ margin: "2rem" }}>
        {data.length !== 0 ? (
          <Container style={styles.mainContainer}>
            <h2 style={{ padding: "1rem" }}> YOUR SURVEYS</h2>
            <Segment>
              <div style={{ backgroundColor: "#fcfcfc" }}>
                <ListExampleCelled
                  surveys={data}
                  history={props.history}
                  setDataChaned={setDataChaned}
                  user={currentLoggedUser}
                />
              </div>
            </Segment>
          </Container>
        ) : (
          <Container style={styles.mainContainer}>
            <Loader active size="big" />
          </Container>
        )}
      </Container>
    </>
  );
}

const styles = {
  mainContainer: {
    margin: "5rem",
    minHeight: "70vh",
    padding: "1rem",
    textAlign: "center",
  },
  smallButton: {
    borderRadius: "50px",
  },
};

const mapStateToProps = (state) => {
  const refToken = localStorage.getItem("refreshToken");
  return {
    token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    currentLoggedUser: state.auth.currentLoggedUser,
  };
};

export default connect(mapStateToProps)(Survey);
