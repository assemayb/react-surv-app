import React, { Fragment } from "react";
import { Segment, List, Divider, Container, Icon } from "semantic-ui-react";

export function Footer() {
  return (
    <Segment style={styles.segment}>
      <Container textAlign="center">
        <List inverted link size="large">
          <List.Item>
            SURV <Icon name="copyright" />
          </List.Item>
          <List.Item>Create surveys about any topics and share them</List.Item>
        </List>
      </Container>
    </Segment>
  );
}

const styles = {
  segment: {
    padding: "1rem",
    color: "white",
    backgroundColor: "#303030",
    left: 0,
    bottom: 0,
    width: "100%",
  },
};
