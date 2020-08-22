import React, { useState } from "react";
// import { Menu, Dropdown, Icon, Button, Responsive } from "semantic-ui-react";
import ActiveLink from "../ActiveLink";
// import Style from "./NavMenu.module.css";
import { useCurrentUser } from "../../lib/hooks";
import { Icon } from "semantic-ui-react";
const SimpleNav = () => {
  const [user] = useCurrentUser();

  const openMenu = (evt) => {
    evt.preventDefault();
    document.getElementById("menubar").classList.toggle("responsive");
    // document.getElementById("menubar").classList.toggle(Style.responsive);
  };
  return (
    <div className="menubar" id="menubar">
      {/* <a href="#home" class="active">
        Home
      </a> */}
      <ActiveLink activeClassName="active" href="/">
        <a>Home</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/weeks">
        <a>Weeks</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/players">
        <a>players</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/info">
        <a>info</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/about">
        <a>about</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/settings">
        <a>settings</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/login">
        <a>login</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/signup">
        <a>sign up</a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/logout">
        <a>logout</a>
      </ActiveLink>
      <a onClick={openMenu} className="icon">
        <Icon aria-label="Bars to open top menu" fitted circular inverted name="bars" />
      </a>
    </div>
  );
};
export default SimpleNav;
