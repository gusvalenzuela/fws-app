import React, { useState, useEffect, useRef } from 'react'
import type { MutableRefObject, FormEvent } from 'react'
import { toast } from 'react-toastify'

const ProfileSection = ({ user, mutateUser }) => {
  const initLayoutPreference = !user?.prefersModernLayout ? 'classic' : 'modern'
  const [isUpdating, setIsUpdating] = useState(false)
  const [layoutPreference, setLayoutPreference] = useState(initLayoutPreference)
  const nameRef: MutableRefObject<HTMLInputElement> = useRef(null)
  const bioRef: MutableRefObject<HTMLTextAreaElement> = useRef(null)
  const profilePictureRef: MutableRefObject<HTMLInputElement> = useRef(null)
  const profileToast = useRef(null)
  // const passwordToast = useRef(null)

  useEffect(() => {
    nameRef.current.value = user.name
    bioRef.current.value = user.bio
  }, [user])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (isUpdating) return
    setIsUpdating(true)
    const formData = new FormData()
    if (profilePictureRef.current.files[0]) {
      formData.append('profilePicture', profilePictureRef.current.files[0])
    }
    if (initLayoutPreference !== layoutPreference) {
      formData.append('layout', layoutPreference)
    }
    formData.append('name', nameRef.current.value)
    formData.append('bio', bioRef.current.value)
    // SEND REQUEST TO UPDATE TO API
    const res = await fetch('/api/user', {
      method: 'PATCH',
      body: formData,
    })
    setIsUpdating(false)
    if (res.status === 200) {
      // SUCCESS TOAST
      if (!toast.isActive(profileToast.current)) {
        profileToast.current = toast.success('Profile successfully updated.', {
          toastId: 'profile-updated',
        })
      }
      // RETURNED USER DATA
      const userData = await res.json()

      // MUTATE USER OBJ
      // for quick visual updates
      mutateUser({
        ...user,
        ...userData.user,
      })
    } else {
      const resData = await res.json()
      const errorMessage =
        resData?.msg || (await res.text()) || 'No user found.'
      // ERROR TOAST
      if (!toast.isActive(profileToast.current)) {
        profileToast.current = toast.error(errorMessage, {
          toastId: 'profile-updated',
        })
      }
    }
  }

  // const handleSubmitPasswordChange = async (e) => {
  //   e.preventDefault()
  //   if (isUpdating) return
  //   setIsUpdating(true)
  //   const body = {
  //     oldPassword: e.currentTarget.oldPassword.value,
  //     newPassword: e.currentTarget.newPassword.value,
  //   }
  //   e.currentTarget.oldPassword.value = ''
  //   e.currentTarget.newPassword.value = ''

  //   const res = await fetch('/api/user/password', {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(body),
  //   })

  //   // AFTER RESPONSE
  //   setIsUpdating(false)
  //   if (res.status === 200) {
  //     // SUCCESS TOAST
  //     if (!toast.isActive(passwordToast.current)) {
  //       passwordToast.current = toast.success(
  //         'Password successfully changed.',
  //         {
  //           toastId: 'password-updated',
  //         }
  //       )
  //     }
  //   } else {
  //     const resData = await res.json()
  //     const errorMessage =
  //       resData?.msg || (await res.text()) || 'No user found.'
  //     // ERROR TOAST
  //     if (!toast.isActive(passwordToast.current)) {
  //       passwordToast.current = toast.error(errorMessage, {
  //         toastId: 'password-updated',
  //       })
  //     }
  //   }
  // }

  async function sendVerificationEmail() {
    await fetch('/api/user/email/verify', {
      method: 'POST',
    })
  }

  return (
    <>
      <style>
        {`
          form {
            display: grid;
            text-align: left;
            padding: 1rem;
          }
          form > * {
            margin-bottom: 10px;
            padding: 0.5rem;
          }
          form h3 {
            text-decoration: underline;
          }
          label {
            font-weight: 600;
          }

          form > button {
            width: 100%;
            max-width: 100px;
            margin: auto;
          }
          div > label > input {
            margin: auto 5px;
          }
          div > label {
            margin-left: 10px;
          }
          form#profileForm > label > input,
          form#profileForm > label > textarea {
            width: 100%;
            margin-left: 10px;
          }
          // form#passwordForm > label {
          //   display: grid;
          //   grid-template-columns: 1fr minmax(50px, 1.6fr);
          //   justify-self: left;
          // }
        `}
      </style>

      <section>
        {!user?.emailVerified ? (
          <p style={{ fontWeight: 800, color: 'var(--brand-color1, #f44)' }}>
            Your email has not been verified. {/* eslint-disable-next-line */}
            <a role="button" onClick={sendVerificationEmail}>
              Send verification email
            </a>
          </p>
        ) : null}
        <form id="profileForm" onSubmit={handleSubmit}>
          <h3>Edit Profile</h3>
          <label htmlFor="name">
            Name:
            <input
              required
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              ref={nameRef}
            />
          </label>
          <label htmlFor="bio">
            Bio:
            <textarea id="bio" name="bio" placeholder="Bio" ref={bioRef} />
          </label>
          <label htmlFor="avatar">
            Profile picture:
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
              ref={profilePictureRef}
            />
          </label>
          <div>
            <p>Choose a layout: </p>
            <label htmlFor="classicLayout">
              <input
                type="radio"
                id="classicLayout"
                name="chooseLayout"
                value="classic"
                onChange={() => setLayoutPreference('classic')}
                checked={layoutPreference === 'classic'}
              />
              Classic
            </label>
            <label htmlFor="modernLayout">
              <input
                type="radio"
                id="modernLayout"
                name="chooseLayout"
                value="modern"
                onChange={() => setLayoutPreference('modern')}
                checked={layoutPreference === 'modern'}
              />
              Modern
            </label>
            <details
              style={{
                textAlign: 'left',
                maxWidth: '350px',
                margin: 'auto',
              }}
            >
              <summary style={{ textAlign: 'center' }}>
                Expand to read more about Modern vs Classic layouts
              </summary>
              <b>Modern Layout:</b>
              <br /> AWAY team is on the left and HOME team is on the right
              (indicated with an @ symbol in middle). Favorite is team with red
              number under their name.
              <br />
              <b>Classic Layout:</b>
              <br /> FAVORITE team is on the left and UNDERDOG is on the right.
              Number in middle is the point-spread needed to cover by favorite
              (left). HOME is team with all capitalized name.
              <br />
            </details>
          </div>
          <button disabled={isUpdating} type="submit">
            Sav{isUpdating ? 'ing' : 'e'}
          </button>
        </form>
        {/* <form id="passwordForm" onSubmit={handleSubmitPasswordChange}>
          <h3>Change your password</h3>
          <label htmlFor="oldpassword">
            Old Password:
            <input
              type="password"
              name="oldPassword"
              id="oldpassword"
              required
            />
          </label>
          <label htmlFor="newpassword">
            New Password:
            <input
              type="password"
              name="newPassword"
              id="newpassword"
              required
            />
          </label>
          <button disabled={isUpdating} type="submit">
            Chang{isUpdating ? 'ing' : 'e'} Password
          </button>
        </form> */}
      </section>
    </>
  )
}

export default ProfileSection
