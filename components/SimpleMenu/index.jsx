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
        <a>Home</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/weeks">
        <a>Weeks</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/players">
        <a>players</a>
      </ActiveLink>
      {/* <ActiveLink activeClassName="active" href="/info">
        <a>info</a>
      </ActiveLink> */}
      {/* <ActiveLink activeClassName="active" href="/about">
        <a>about</a>
      </ActiveLink> */}
      {user && user._id ? (
        <>
          <ActiveLink activeClassName="active" href="/settings">
            <a>settings</a>
          </ActiveLink>

          <ActiveLink activeClassName="active" href="/logout">
            <a>logout</a>
          </ActiveLink>
        </>
      ) : (
        <>
          <ActiveLink activeClassName="active" href="/login">
            <a>login</a>
          </ActiveLink>
          <ActiveLink activeClassName="active" href="/signup">
            <a>sign up</a>
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
