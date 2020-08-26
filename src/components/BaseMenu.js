import React, { useState, Fragment } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const BaseMenu = (props) => {
  const [activeItem, setactiveItem] = useState("home");
  const handleItemClick = (e, { name }) => {
    setactiveItem(name);
  };
  return (
    <Menu
      color="blue"
      size="large"
      widths={5}
      compact
      inverted
      style={styles.menu}
    >
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        style={styles.item}
      >
        <NavLink to="/">
          <Icon name="home" />
          Home
        </NavLink>
      </Menu.Item>

      <Menu.Item
        name="my surveys"
        active={activeItem === "my surveys"}
        onClick={handleItemClick}
        style={styles.item}
      >
        <Link to="/surveys">
          <Icon name="edit" />
          Surveys
        </Link>
      </Menu.Item>

      <Menu.Item
        name="profile"
        active={activeItem === "profile"}
        onClick={handleItemClick}
        style={styles.item}
      >
        <Link to="/profile">
          <Icon name="user outline" />
          profile
        </Link>
      </Menu.Item>
    </Menu>
  );
};

const styles = {
  menu: {
    padding: "1rem",
  },
  item: {
    padding: "1rem",
  },
};

// const mapStateToProps = (state) => {
//   return {
//     token: state.auth.token,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     logout: () => dispatch(authLogout()),
//   };
// };

export default connect()(BaseMenu);
