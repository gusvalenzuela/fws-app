import React, { createRef } from 'react'
import { useRouter } from 'next/router'
import { Menu, Dropdown, Icon } from 'semantic-ui-react'
import { useCurrentUser, useAllUsers } from '../../lib/hooks'
import Store from '../../lib/stores/FootballPool'
import { generateNumbersArray } from '../../lib/utils'

const Menubar = () => {
  const [users] = useAllUsers()
  const [user] = useCurrentUser()
  const router = useRouter()
  const menubar = createRef()

  const toggleResponsiveMenu = () =>
    menubar.current.classList.toggle('responsive')

  const handleWeekChange = (e, { value }) => {
    toggleResponsiveMenu() // to hide menu on mobile when item clicked
    Store.setState({ week: value })
    router.push('/weeks?sport=nfl&yr=2020')
  }

  const handleSeasonChange = (e, { value }) => {
    toggleResponsiveMenu() // to hide menu on mobile when item clicked
    Store.setState({ seasonYear: value })
    router.push('/weeks?sport=nfl&yr=2020')
  }
  const handleUserChange = (e, { value }) => {
    toggleResponsiveMenu() // to hide menu on mobile when item clicked
    Store.setState({ selectedUser: value })
    router.push('/weeks?sport=nfl&yr=2020')
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
      <nav className="menubar responsive" id="menubar" ref={menubar}>
        <div className="menubar--menu">
          <Menu inverted stackable attached="top">
            <Menu.Header
              onClick={toggleResponsiveMenu}
              as="h3"
              className="menubar-header"
            >
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
                toggleResponsiveMenu() // this assures the responsive menu is closed when clicked
                // when user clicks home, reset a few globally stored states
                // set "selectedUser" to undefined when clicking home, defaults to current user
                Store.setState({
                  selectedUser: user ? user._id : undefined,
                  week: Store.getState().currentWeek,
                  season: Store.getState().currentSeasonYear,
                })
                if (user) {
                  router.push('/weeks?sport=nfl&yr=2020')
                } else {
                  router.push('/')
                }
              }}
            >
              Home
            </Dropdown.Item>
            <Dropdown
              // selection
              selectOnNavigation={false}
              options={generateNumbersArray(2020, 2020).map((num) => ({
                key: num,
                text: `Season ${num}`,
                value: num,
              }))}
              item
              text="Seasons"
              onChange={handleSeasonChange}
            />
            <Dropdown
              selectOnNavigation={false}
              options={generateNumbersArray().map((num) => ({
                key: num,
                text: num,
                value: num,
              }))}
              item
              text="Weeks"
              onChange={handleWeekChange}
            />
            <Dropdown
              selectOnNavigation={false}
              options={
                // basic users' data is pulled from DB and a dropdown made for each
                users?.map(({ name, _id }, index) => ({
                  key: index,
                  text: `${name}`,
                  value: _id,
                }))
              }
              item
              text="Users"
              onChange={handleUserChange}
            />
            {/* <Dropdown.Item
              as="a"
              onClick={() => {
                toggleResponsiveMenu() // this assures the responsive menu is closed when clicked

                router.push('/leaderboard')
              }}
            >
              Leaderboards
            </Dropdown.Item> */}
            <Menu.Menu position="right">
              {!user ? (
                <>
                  <Dropdown.Item
                    as="button"
                    // href="/login"
                    onClick={() => {
                      router.push('/login')
                      toggleResponsiveMenu()
                    }}
                  >
                    Log In
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      router.push('/signup')
                      toggleResponsiveMenu()
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
                              toggleResponsiveMenu()
                            }}
                          />
                        )
                      }
                      <Dropdown.Item
                        text="Settings"
                        icon="settings"
                        onClick={() => {
                          router.push('/settings')
                          toggleResponsiveMenu()
                        }}
                      />
                      <Dropdown.Item
                        icon="log out"
                        text="Log out"
                        onClick={() => {
                          router.push('/logout')
                          toggleResponsiveMenu()
                        }}
                      />
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
            </Menu.Menu>
          </Menu>
        </div>
        <button
          type="button"
          tabIndex={0}
          onClick={toggleResponsiveMenu}
          className="icon"
        >
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
