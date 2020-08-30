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
import ListExampleCelled from './CardsList'

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

export const styles = {
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
