import React from "react";

import { Icon, Segment, Card } from "semantic-ui-react";

const SurveyCardItem = ({ surveyData, history }) => {
  let created_at_date;
  created_at_date = surveyData.created_at.split(" ");
  created_at_date = created_at_date[0];
  const cardDescription = `${surveyData.questions_num} questions`;
  const cardHref = `survey/${surveyData.id}`;
  const enterSurvey = () => {
    history.push(cardHref);
  };
  return (
    <Card
      onClick={enterSurvey}
      style={{
        borderRadius: "10px",
        width: "200px",
        backgroundColor: "#efefef",
        boxShadow: "3px 3px 6px 2px rgba(0,0,0,0.39)",
      }}
    >
      <Card.Content>
        <Card.Header>
          <h2 style={{ color: "DodgerBlue" }}>
            <Icon name="wpforms" /> {surveyData.theme}
          </h2>
        </Card.Header>
        <Segment style={{ backgroundColor: "#fff", borderRadius: "8px" }}>
          <Card.Description>
            <h4>{cardDescription}</h4>
          </Card.Description>
          <Card.Content extra>
            <Icon name="time" />
            {created_at_date}
          </Card.Content>
        </Segment>
      </Card.Content>
    </Card>
  );
};

export default SurveyCardItem;
