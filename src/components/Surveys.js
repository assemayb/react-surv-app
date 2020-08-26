import React, { useEffect, useState } from "react";
import {
  Container,
  Image,
  List,
  Header,
  ListDescription,
  Icon,
  Loader,
  Segment,
  Card,
} from "semantic-ui-react";
import axios from "axios";
import { connect } from "react-redux";

const CardItem = ({ surveyData }) => {
  let created_at_date;
  created_at_date = surveyData.created_at.split(" ");
  created_at_date = created_at_date[0];
  const cardDescription = `${surveyData.questions_num} questions`;
  const cardHref = `survey/${surveyData.id}`;
  return (
    <Card
      style={{
        borderRadius: "10px",
        width: "200px",
        backgroundColor: "#efefef",
      }}
      href={cardHref}
    >
      <Card.Content>
        <Card.Header>
          <h2 style={{ color: "DodgerBlue" }}>{surveyData.theme}</h2>
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

const ListExampleCelled = ({ surveys }) => {
  return (
    <List
      horizontal
      size="large"
      style={{ margin: "0.5rem", padding: "0.5rem" }}
    >
      {surveys.map((sur) => {
        return (
          <List.Item style={{ margin: "1rem", padding: "2rem" }}>
            <CardItem raised surveyData={sur} />
          </List.Item>
        );
      })}
    </List>
  );
};
function Survey(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getUserSurv = () => {
      const user = props.currentLoggedUser;
      axios
        .get(`http://127.0.0.1:5000/user-surveys?username=${user}`)
        .then((res) => {
          setTimeout(() => {
            setData(res.data)
          }, 300)
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getUserSurv();
  }, []);

  return (
    <>
      {data.length !== 0 ? (
        <Container style={styles.mainContainer}>
          <h2 style={{ padding: "1rem" }}> YOUR SURVEYS</h2>
          <Segment>
            <div style={{ backgroundColor: "#fcfcfc" }}>
              <ListExampleCelled surveys={data} />
            </div>
          </Segment>
        </Container>
      ) : (
        <Container style={styles.mainContainer}>
          <Loader active size="big" />
        </Container>
      )}
    </>
  );
}

const styles = {
  mainContainer: {
    margin: "5rem",
    height: "70vh",
    padding: "1rem",
    textAlign: "center",
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