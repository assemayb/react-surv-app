import React, { useState, Fragment } from "react";
import { Menu, Icon, Dropdown, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const BaseMenu = (props) => {
  let path = document.location.pathname;
  path = path.slice(1, path.length);
  const [activeItem, setactiveItem] = useState(path);
  const handleItemClick = (e, { name }) => {
    setactiveItem(name);
  };
  const isAuth = props.token;
  return (
    <>
      {isAuth !== null ? (
        <Menu
          color="blue"
          size="large"
          widths={4}
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
              <Icon name="home" /> Home
            </NavLink>
          </Menu.Item>

          <Menu.Item
            name="my surveys"
            active={activeItem === "my surveys"}
            onClick={handleItemClick}
            style={styles.item}
          >
            <Link to="/surveys">
              <Icon name="edit" /> Surveys
            </Link>
          </Menu.Item>

          <Menu.Item
            name="profile"
            active={activeItem === "profile"}
            onClick={handleItemClick}
            style={styles.item}
          >
            <Link to="/profile">
              <Icon name="user outline" /> profile
            </Link>
          </Menu.Item>
        </Menu>
      ) : (
        <Menu
          color="blue"
          size="large"
          widths={10}
          compact
          inverted
          style={styles.menu}
        >
          <Menu.Item
            name="my surveys"
            active={activeItem === "my surveys"}
            style={styles.item}
          >
            <Icon name="edit" /> Surveys
          </Menu.Item>
        </Menu>
      )}
    </>
  );
};

const styles = {
  menu: {
    padding: "1rem",
    fontSize: "1.2rem",
    position: "sticky",
    top: "0",
    zIndex: "1"

  },
  item: {
    padding: "1rem",
  },
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     logout: () => dispatch(authLogout()),
//   };
// };

export default connect(mapStateToProps)(BaseMenu);
