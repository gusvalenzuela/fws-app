import React, { createRef } from 'react'
import { useRouter } from 'next/router'
import { Menu, Dropdown, Icon } from 'semantic-ui-react'
import { generateNumbersArray } from '../../lib/utils'
import { useCurrentUser } from '../../lib/hooks'
import Store from '../../lib/stores/FootballPool'
import Styles from './Menubar.module.css'

const Menubar = () => {
  const router = useRouter()
  const users = Store((s) => s.allUsers)
  const [user] = useCurrentUser()
  const menubar = createRef()
  const selectedSport = 'football'
  const selectedSeasonYear = Store((s) => s.seasonYear || s.currentSeasonYear)

  const toggleResponsiveMenu = () =>
    menubar.current.classList.toggle(`responsive`)

  const handleWeekChange = (_e, { value }) => {
    toggleResponsiveMenu() // to hide menu on mobile when item clicked
    Store.setState({ week: value })

    if (router.pathname !== '/weeks') {
      router.push(`/weeks?sport=${selectedSport}&yr=${selectedSeasonYear}`)
    }

    return null
  }

  const handleSeasonChange = (_e, { value }) => {
    toggleResponsiveMenu() // to hide menu on mobile when item clicked
    Store.setState({ seasonYear: value })

    if (router.pathname !== '/weeks') {
      router.push(`/weeks?sport=${selectedSport}&yr=${value}`)
    }

    return null
  }
  const handleUserChange = (_e, { value }) => {
    toggleResponsiveMenu() // to hide menu on mobile when item clicked
    Store.setState({ selectedUser: value })
    if (router.pathname !== '/weeks') {
      router.push(`/weeks?sport=${selectedSport}&yr=${selectedSeasonYear}`)
    }
    return null
  }

  return (
    <nav className="menubar responsive" id="menubar" ref={menubar}>
      <div>
        <Menu stackable attached="top">
          <Menu.Header
            onClick={toggleResponsiveMenu}
            as="h3"
            className={Styles.menubarHeader}
          >
            <span>FWS Pool </span>
            {user && (
              <span
                style={{ color: 'var(--brand-color1)', fontWeight: 'bolder' }}
              >
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
                router.push(
                  `/weeks?sport=${selectedSport}&yr=${selectedSeasonYear}`
                )
              } else {
                router.push('/')
              }
            }}
          >
            Home
          </Dropdown.Item>
          {user && (
            <>
              {' '}
              <Dropdown
                // selection
                selectOnNavigation={false}
                options={generateNumbersArray(2020, 2021).map((num) => ({
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
              {/* <Dropdown.Item
              as="a"
              onClick={() => {
                toggleResponsiveMenu() // this assures the responsive menu is closed when clicked

                router.push(
                  `/weeks?sport=${selectedSport}&yr=${selectedSeasonYear}`
                )
              }}
            >
              Weeks
            </Dropdown.Item> */}
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
            </>
          )}
          <Dropdown item text="Leaderboards">
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  toggleResponsiveMenu()
                  router.push(`/leaderboard/weekly`)
                }}
                text="Weekly Leaderboard"
                // icon="clipboard"
              />
              <Dropdown.Item
                text="Season Leaderboard"
                onClick={() => {
                  toggleResponsiveMenu()
                  router.push('/leaderboard/season')
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
          {/* <Dropdown.Item
            as="a"
            onClick={() => {
              toggleResponsiveMenu() // this assures the responsive menu is closed when clicked

              router.push('/about')
            }}
          >
            About
          </Dropdown.Item> */}
          <Menu.Menu position="right">
            {!user ? (
              <>
                <Dropdown.Item
                  as="button"
                  // href="/login"
                  onClick={() => {
                    toggleResponsiveMenu()
                    router.push('/login')
                  }}
                >
                  Log In
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  onClick={() => {
                    toggleResponsiveMenu()
                    router.push('/signup')
                  }}
                >
                  Sign Up
                </Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown simple item text="My Account">
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        toggleResponsiveMenu()
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
                            toggleResponsiveMenu()
                            router.push('/admin')
                          }}
                        />
                      )
                    }
                    <Dropdown.Item
                      text="Settings"
                      icon="settings"
                      onClick={() => {
                        toggleResponsiveMenu()
                        router.push('/settings')
                      }}
                    />
                    <Dropdown.Item
                      icon="log out"
                      text="Log out"
                      onClick={() => {
                        toggleResponsiveMenu()
                        router.push('/logout')
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
  )
}
export default Menubar
