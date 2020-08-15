import ActiveLink from "./ActiveLink";
import Style from "./Nav.module.css";

const Nav = () => (
  <nav className="mainNav">
    <ul className={Style.navList}>
      <li>
        <ActiveLink activeClassName={Style.active} href="/">
          <a className={Style.navLink}>Home</a>
        </ActiveLink>
      </li>
      <li>
        <ActiveLink activeClassName={Style.active} href="/weeks">
          <a className={Style.navLink}>Weeks</a>
        </ActiveLink>
      </li>
      <li>
        <ActiveLink activeClassName={Style.active} href="/players">
          <a className={Style.navLink}>Players</a>
        </ActiveLink>
      </li>
      <li>
        <ActiveLink activeClassName={Style.active} href="/seasons">
          <a className={Style.navLink}>Seasons</a>
        </ActiveLink>
      </li>
      <li>
        <ActiveLink activeClassName={Style.active} href="/info">
          <a className={Style.navLink}>Info</a>
        </ActiveLink>
      </li>
      <li>
        <ActiveLink activeClassName={Style.active} href="/account">
          <a className={Style.navLink}>My Account</a>
        </ActiveLink>
      </li>
      <li>
        <ActiveLink activeClassName={Style.active} href="/about">
          <a className={Style.navLink}>About</a>
        </ActiveLink>
      </li>
    </ul>
  </nav>
);

export default Nav;
