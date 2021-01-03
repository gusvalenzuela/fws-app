import React from 'react'
import { useRouter } from 'next/router'
import { Menu, Dropdown, Icon } from 'semantic-ui-react'
import { useCurrentUser, getAllUsers } from '../../lib/hooks'
import Store from '../../lib/stores/FootballPool'
import { generateNumbersArray } from '../../lib/utils'

const Menubar = () => {
  const [user] = useCurrentUser()
  const [users] = getAllUsers()
  const router = useRouter()
  // const seasonRef = createRef()
  const openMenu = () => {
    return document.getElementById('menubar').classList.toggle('responsive')
  }

  const handleWeekChange = (e, target) => {
    openMenu() // to hide menu on mobile when item clicked
    Store.setState({ week: target.value })
    router.push('/weeks')
  }

  const handleSeasonChange = (e, target) => {
    openMenu() // to hide menu on mobile when item clicked
    Store.setState({ season: target.value })
    router.push('/weeks')
  }
  const handleUserChange = (e, target) => {
    openMenu() // to hide menu on mobile when item clicked
    Store.setState({ selectedUser: target.value })
    router.push('/weeks')
  }

  return (
    <>
      <style jsx>
        {`
          .menubar {
            background-color: #1b1c1d;
          }
          .menubar--menu {
            width: 100%;
            max-width: 1074px !important;
            margin: auto;
          }

          /* when pointer is a mouse (fine) */
          @media (hover: hover) and (pointer: fine) {
            .menubar button:hover {
              background-color: #ddd;
              color: black;
            }
          }
          .top.stackable.menu {
            border-radius: 0 !important;
            background-color: #1a1a1a !important;
          }
          .right.menu button {
            margin: 0.25rem;
            border: none;
            /* max-width: fit-content; */
            background-color: #1b3094 !important;
          }
          .menu.transition.visible {
            overflow: auto;
            max-height: 200px;
          }
          .menubar-header {
            padding: 1rem;
            margin: 0 !important;
          }
          .menubar button.active {
            background-color: var(--base-warm-light);
            color: white;
          }
          .menubar button.icon {
            display: none;
            background: transparent;
            border: none;
          }
          @media screen and (max-width: 766px) {
            .menubar button:not(:first-child) {
              display: none;
            }
            .menubar button.icon {
              position: absolute;
              right: 7px;
              top: 7px;
              display: block;
            }
            .menubar.responsive {
              position: relative;
            }
            .menubar.responsive .menu > a,
            .menubar.responsive .menu > div {
              float: none !important;
              display: none !important;
              text-align: left !important;
            }
            /* when collapsed the buttons need to have max-width: ; */
            .right.menu button {
              max-width: max-content !important;
            }
            .right.menu {
              flex-direction: initial !important;
              justify-content: center !important;
            }
          }
        `}
      </style>
      <nav className="menubar responsive" id="menubar">
        <div className="menubar--menu">
          <Menu inverted stackable attached="top">
            <Menu.Header onClick={openMenu} as="h3" className="menubar-header">
              <span style={{ color: '#EADFFB' }}>FWS Pool </span>
              {user && (
                <span style={{ color: '#FFF70F', fontWeight: 'bolder' }}>
                  {` | ${user.name}`}
                </span>
              )}
            </Menu.Header>
            <Dropdown.Item
              as="a"
              onClick={() => {
                openMenu() // this assures the responsive menu is closed when clicked
                // when user clicks home, reset a few globally stored states
                // set "selectedUser" to undefined when clicking home, defaults to current user
                Store.setState({
                  selectedUser: user ? user._id : undefined,
                  week: undefined,
                  season: 2020,
                })
                if (user) {
                  router.push('/weeks')
                } else {
                  router.push('/')
                }
              }}
            >
              Home
            </Dropdown.Item>
            <Dropdown
              options={generateNumbersArray(2020, 2020).map((num) => {
                return { key: num, text: num, value: num }
              })}
              item
              text="Seasons"
              onChange={handleSeasonChange}
            />
            <Dropdown
              options={generateNumbersArray().map((num) => {
                return { key: num, text: num, value: num }
              })}
              item
              text="Weeks"
              onChange={handleWeekChange}
            />
            <Dropdown
              options={
                // basic users data is pulled from DB and a dropdown made for each
                users?.map(({ name, _id }, index) => {
                  return { key: index, text: `${name}`, value: _id }
                })
              }
              item
              text="Users"
              onChange={handleUserChange}
            />
            <Menu.Menu position="right">
              {!user ? (
                <>
                  <Dropdown.Item
                    as="button"
                    // href="/login"
                    onClick={() => {
                      router.push('/login')
                      openMenu()
                    }}
                  >
                    Log In
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      router.push('/signup')
                      openMenu()
                    }}
                  >
                    Sign Up
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown className="account" simple item text="My Account">
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          router.push(`/user/${user._id}`)
                        }}
                      >
                        My Profile
                      </Dropdown.Item>
                      {
                        // add dropdown for admin page, if user is an Admin User
                        user?.isAdmin && (
                          <Dropdown.Item
                            text="Admin Page"
                            onClick={() => {
                              router.push('/admin')
                              openMenu()
                            }}
                          />
                        )
                      }
                      <Dropdown.Item
                        text="Settings"
                        icon="settings"
                        onClick={() => {
                          router.push('/settings')
                          openMenu()
                        }}
                      />
                      <Dropdown.Item
                        icon="log out"
                        text="Log out"
                        onClick={() => {
                          router.push('/logout')
                          openMenu()
                        }}
                      />
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
            </Menu.Menu>
          </Menu>
        </div>
        <button type="button" tabIndex={0} onClick={openMenu} className="icon">
          <Icon
            aria-label="Top bar to open menu"
            fitted
            circular
            inverted
            name="bars"
          />
        </button>
      </nav>
    </>
  )
}
export default Menubar
