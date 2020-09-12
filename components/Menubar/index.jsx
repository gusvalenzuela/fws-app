import React from "react";
import { useRouter } from "next/router";
import { useCurrentUser, getAllUsers } from "../../lib/hooks";
import { Menu, Dropdown, Icon } from "semantic-ui-react";
import Store from "../../lib/stores/FootballPool";

const Menubar = () => {
  const [user] = useCurrentUser();
  const [users] = getAllUsers();
  const router = useRouter();

  const generateNumbersArray = (count = 1, max = 17) => {
    let array = [];

    while (count <= max) {
      array.push(count);
      count++;
    }

    return array;
  };

  const handleWeekChange = (e, target) => {
    openMenu(); // to hide menu on mobile when item clicked
    Store.setState({ week: target.value });
    router.push("/weeks");
  };

  const handleSeasonChange = (e, target) => {
    openMenu(); // to hide menu on mobile when item clicked
    Store.setState({ season: target.value });
    router.push("/weeks");
  };
  const handleUserChange = (e, target) => {
    openMenu(); // to hide menu on mobile when item clicked
    Store.setState({ selectedUser: target.value });
    router.push("/weeks");
  };

  const openMenu = () => {
    return document.getElementById("menubar").classList.toggle("responsive");
  };

  return (
    <nav className="menubar" id="menubar">
      <Menu inverted stackable attached="top">
        <Menu.Header onClick={openMenu} as="h3" className="menubar-header">
          <span style={{ color: "#EADFFB" }}>FWS Football Pool</span>{" "}
          {user ? (
            <span style={{ color: "#FFF70F", fontWeight: "bolder" }}>
              {" "}
              | {user.name}
            </span>
          ) : (
            ""
          )}
        </Menu.Header>
        <Dropdown.Item
          as="a"
          onClick={() => {
            router.push("/");
            // when user clicks home, reset a few globally stored states
            // set "selectedUser" to undefined when clicking home, defaults to current user
            Store.setState({ selectedUser: undefined, week: 1, season: 2020 });
            openMenu(); // this assures the responsive menu is closed when clicked
          }}
        >
          Home
        </Dropdown.Item>
        <Dropdown item text="Seasons">
          <Dropdown.Menu>
            {generateNumbersArray(2020, 2020).map((num) => {
              return (
                <Dropdown.Item
                  key={num}
                  text={num}
                  value={num}
                  onClick={handleSeasonChange}
                />
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item text="Weeks">
          <Dropdown.Menu>
            {
              // generateNumbersArray's two args default to (min = 1 ,max = 17)
              generateNumbersArray().map((num) => {
                return (
                  <Dropdown.Item
                    className="menu-dropdown"
                    key={num}
                    text={num}
                    value={num}
                    onClick={handleWeekChange}
                  />
                );
              })
            }
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item text="Users">
          <Dropdown.Menu>
            {
              // basic users data is pulled from DB and a dropdown made for each
              users?.map((u, index) => {
                return (
                  <Dropdown.Item
                    key={index}
                    onClick={handleUserChange}
                    value={u._id}
                  >
                    {u.name}
                  </Dropdown.Item>
                );
              })
            }
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu position="right">
          {!user ? (
            <>
              <Dropdown.Item
                as="a"
                onClick={() => {
                  router.push("/login");
                  openMenu();
                }}
              >
                Log In
              </Dropdown.Item>
              <Dropdown.Item
                as="a"
                onClick={() => {
                  router.push("/signup");
                  openMenu();
                }}
              >
                Sign Up
              </Dropdown.Item>
            </>
          ) : (
            <>
              <Dropdown.Item
                as="a"
                onClick={() => {
                  router.push("/user/" + user._id);
                }}
              >
                My Account
              </Dropdown.Item>
              <Dropdown.Item
                as="a"
                onClick={() => {
                  router.push("/logout");
                  openMenu();
                }}
              >
                Log Out
              </Dropdown.Item>
            </>
          )}
        </Menu.Menu>
      </Menu>
      <a onClick={openMenu} className="icon">
        <Icon
          aria-label="Top bar to open menu"
          fitted
          circular
          inverted
          name="bars"
        />
      </a>
    </nav>
  );
};
export default Menubar;
