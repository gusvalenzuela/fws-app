import React, { useEffect } from "react";
import ActiveLink from "../ActiveLink";
import { useCurrentUser } from "../../lib/hooks";
import { Icon } from "semantic-ui-react";
const SimpleNav = () => {
  const [user] = useCurrentUser();

  const openMenu = () => {
    return document.getElementById("menubar").classList.toggle("responsive");
  };
  
  return (
    <nav className="menubar" id="menubar">
      <div role="header">FWS Football Pool</div>
      <ActiveLink activeClassName="active" href="/">
        <a onClick={openMenu}>Home</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/weeks">
        <a onClick={openMenu}>Weeks</a>
      </ActiveLink>

      {/* <ActiveLink activeClassName="active" href="/info">
        <a onClick={openMenu}>info</a>
      </ActiveLink> */}
      {/* <ActiveLink activeClassName="active" href="/about">
        <a onClick={openMenu}>about</a>
      </ActiveLink> */}
      {user && user._id ? (
        <>
          <ActiveLink activeClassName="active" href="/players">
            <a onClick={openMenu}>players</a>
          </ActiveLink>
          <ActiveLink activeClassName="active" href="/settings">
            <a onClick={openMenu}>settings</a>
          </ActiveLink>
          <ActiveLink activeClassName="active" href="/logout">
            <a style={{ float: "right" }}>logout</a>
          </ActiveLink>
        </>
      ) : (
        <>
          <ActiveLink activeClassName="active" href="/login">
            <a onClick={openMenu}>login</a>
          </ActiveLink>
          <ActiveLink activeClassName="active" href="/signup">
            <a onClick={openMenu}>sign up</a>
          </ActiveLink>
        </>
      )}

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
export default SimpleNav;
