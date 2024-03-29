import React, { createRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Menu, Dropdown, Icon } from 'semantic-ui-react'
import { generateNumbersArray } from '../../lib/utils'
import { useCurrentUser } from '../../lib/hooks'
import Store from '../../lib/stores/FootballPool'
import Styles from './Menubar.module.css'

const Menubar = ({ darkMode }) => {
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

  useEffect(() => {
    const mainElement = document.querySelector('main')
    const bodyElement = document.querySelector('body')
    const pageHeaderElement = document.querySelector('.page-header')
    const navElement = document.querySelector('.menuNav')
    const currentTheme = `var(--${darkMode ? 'dark' : 'light'}-mode)`
    const alternateTheme = `var(--${!darkMode ? 'dark' : 'light'}-mode)`

    if (mainElement) {
      mainElement.style.backgroundColor = currentTheme
      mainElement.style.color = alternateTheme
    }
    if (bodyElement) {
      bodyElement.style.backgroundColor = currentTheme
      bodyElement.style.color = alternateTheme
    }
    if (pageHeaderElement) {
      pageHeaderElement.style.color = alternateTheme
    }
    if (navElement) {
      // navElement.style.backgroundColor = currentTheme
      navElement.style.borderColor = currentTheme
      navElement.style.color = alternateTheme
    }
  }, [menubar, darkMode])

  // on USER CHANGE
  useEffect(() => {
    if (!user) return null
    if (user.colorTheme) {
      Store.setState({ darkMode: user.colorTheme === 'dark' })
    }
    return () => {}
  }, [user])

  return (
    <nav className="menubar responsive" id="menubar" ref={menubar}>
      <Menu
        inverted={darkMode}
        className="menuNav"
        stackable
        fixed="top"
        // attached="top"
      >
        <Menu.Header
          onClick={toggleResponsiveMenu}
          as="h5"
          className={Styles.menubarHeader}
        >
          <span style={{ color: user ? 'var(--brand-color1)' : '' }}>
            FWS Pool
          </span>
          {/* {user && (
            <span
              style={{ color: 'var(--brand-color1)', fontWeight: 'bolder' }}
            >
              {` | ${user.name || user.email.split('@')[0]}`}
            </span>
          )} */}
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
              seasonYear: Store.getState().currentSeasonYear,
            })
            if (user) {
              router.push(`/weeks?sport=${selectedSport}`)
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
              options={generateNumbersArray(2020, 2022).map((num) => ({
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
              options={generateNumbersArray(
                1,
                selectedSeasonYear < 2021 ? 17 : 18
              ).map((num) => ({
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
                users?.map(({ name, _id, email }, index) => ({
                  key: index,
                  text: `${name || email}`,
                  value: _id,
                }))
              }
              item
              text="Users"
              onChange={handleUserChange}
            />
          </>
        )}
        <Dropdown item text="Info">
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
        <Menu.Item>
          <div
            tabIndex={0}
            role="button"
            id="darkModeButton"
            title={`Change to ${
              darkMode ? 'light' : 'dark'
            } mode. Pro tip: Make permanent in settings page.`}
            className={Styles.darkModeButton}
            onClick={() => Store.setState({ darkMode: !darkMode })}
          >
            <Icon
              size="large"
              // fitted
              flipped="horizontally"
              inverted={darkMode}
              name={!darkMode ? 'moon' : 'sun'}
            />
          </div>
        </Menu.Item>
        <Menu.Menu position="right">
          {!user ? (
            <>
              <Dropdown.Item
                as="button"
                onClick={() => {
                  toggleResponsiveMenu()
                  router.push('/signin')
                }}
              >
                Sign In
              </Dropdown.Item>
              {/* <Dropdown.Item
                as="button"
                onClick={() => {
                  toggleResponsiveMenu()
                  router.push('/signup')
                }}
              >
                Sign Up
              </Dropdown.Item> */}
            </>
          ) : (
            <Dropdown simple item text="Account">
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
                  text="Sign Out"
                  onClick={() => {
                    toggleResponsiveMenu()
                    router.push('/signout')
                  }}
                />
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Menu.Menu>
      </Menu>
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
Menubar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
}
export default Menubar
