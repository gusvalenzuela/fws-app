import React, { useState } from "react";
import { Menu, Dropdown, Icon } from "semantic-ui-react";
import ActiveLink from "../ActiveLink";
import Style from "./NavMenu.module.css";
import { useCurrentUser } from "../../lib/hooks";
const NavMenu = () => {
  const [user] = useCurrentUser();
  const [activeItem, setActiveItem] = useState();
  const handleItemClick = (e, { name }) => setActiveItem(name);
  return (
    <Menu className={Style.nav} attached="top" compact pointing secondary>
      <Menu.Item header>FWS Football Pool</Menu.Item>

      <Menu.Item
        as="div"
        className={Style.navLink}
        name="home"
        content={
          <ActiveLink activeClassName="active-link" href="/">
            <a>Home</a>
          </ActiveLink>
        }
        active={activeItem === "home"}
        onClick={handleItemClick}
      />

      <Menu.Item
        as="div"
        className={Style.navLink}
        name="weeks"
        content={
          <ActiveLink activeClassName="active-link" href="/weeks">
            <a>Weeks</a>
            {/* <Dropdown as="a" item icon="dropdown" text="Weeks" simple>
              <Dropdown.Menu>
                <Dropdown.Item>1</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
          </ActiveLink>
        }
        active={activeItem === "weeks"}
        onClick={handleItemClick}
      />
      <Menu.Item
        as="div"
        className={Style.navLink}
        name="players"
        content={
          <ActiveLink activeClassName="active-link" href="/players">
            <a>Players</a>
          </ActiveLink>
        }
        active={activeItem === "players"}
        onClick={handleItemClick}
      />
      <Menu.Item
        as="div"
        className={Style.navLink}
        name="seasons"
        content={
          <ActiveLink activeClassName="active-link" href="/seasons">
            <a>Seasons</a>
          </ActiveLink>
        }
        onClick={handleItemClick}
      />
      <Menu.Item
        as="div"
        className={Style.navLink}
        name="info"
        content={
          <ActiveLink activeClassName="active-link" href="/info">
            <a>Info</a>
          </ActiveLink>
        }
        onClick={handleItemClick}
      />
      <Menu.Item
        as="div"
        className={Style.navLink}
        name="about"
        content={
          <ActiveLink activeClassName="active-link" href="/about">
            <a>About</a>
          </ActiveLink>
        }
        onClick={handleItemClick}
      />
      {user && user._id ? (
        <>
          <Menu.Item
            as="div"
            className={Style.navLink}
            name="settings"
            content={
              <ActiveLink activeClassName="active-link" href="/settings">
                <a>Settings</a>
              </ActiveLink>
            }
            onClick={handleItemClick}
          />
          <Menu.Item
            as="div"
            className={Style.navLink}
            name="logout"
            content={
              <ActiveLink activeClassName="active-link" href="/logout">
                <a>Logout</a>
              </ActiveLink>
            }
            onClick={handleItemClick}
          />
        </>
      ) : (
        <Menu.Item
          as="div"
          className={Style.navLink}
          name="signUp"
          content={
            <ActiveLink activeClassName="active-link" href="/signup">
              <a>Sign Up</a>
            </ActiveLink>
          }
          onClick={handleItemClick}
        />
      )}
    </Menu>
  );
};
export default NavMenu;

// export default class MenuExampleHeader extends Component {
//   state = {}

//   // const [user] = useCurrentUser();

//   handleItemClick = (e, { name }) => this.setState({ activeItem: name })

//   render() {
//     const { activeItem } = this.state

//     return (
//       <Menu>
//         <Menu.Item
//           name='aboutUs'
//           active={activeItem === 'aboutUs'}
//           onClick={this.handleItemClick}
//         />
//         <Menu.Item
//           name='jobs'
//           active={activeItem === 'jobs'}
//           onClick={this.handleItemClick}
//         />
//         <Menu.Item
//           name='locations'
//           active={activeItem === 'locations'}
//           onClick={this.handleItemClick}
//         />
//       </Menu>
//     )
//   }
// }
