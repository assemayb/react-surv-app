import React from "react";
import { List, Button, Popup } from "semantic-ui-react";
import { styles } from './Surveys'
import axios from "axios";
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
  const handlePopupClose = (surveyId) => {
    document.getElementById(`delete-button-${surveyId}`).click();
  };
  const editSurvey = (surveyId) => {
    history.push(`/survey-edit/${surveyId}`)
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
                  onClick={() => handlePopupClose(sur.id)}
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

export default ListExampleCelled;
