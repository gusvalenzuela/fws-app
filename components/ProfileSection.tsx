import React, { useState, useEffect, useRef } from 'react'
import type { MutableRefObject, FormEvent } from 'react'
import { useCurrentUser } from '../lib/hooks'

const Style = () => (
  <style jsx>
    {`
      form {
        display: flex;
      }
    `}
  </style>
)

const ProfileSection = () => {
  const [user, { mutate }] = useCurrentUser()
  const [isUpdating, setIsUpdating] = useState(false)
  const nameRef: MutableRefObject<HTMLInputElement> = useRef(null)
  const bioRef: MutableRefObject<HTMLTextAreaElement> = useRef(null)
  const profilePictureRef: MutableRefObject<HTMLInputElement> = useRef(null)
  const [msg, setMsg] = useState({ message: '', isError: false })

  useEffect(() => {
    nameRef.current.value = user.name
    bioRef.current.value = user.bio
  }, [user])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isUpdating) return
    setIsUpdating(true)
    const formData = new FormData()
    if (profilePictureRef.current.files[0]) {
      formData.append('profilePicture', profilePictureRef.current.files[0])
    }
    formData.append('name', nameRef.current.value)
    formData.append('bio', bioRef.current.value)
    const res = await fetch('/api/user', {
      method: 'PATCH',
      body: formData,
    })
    if (res.status === 200) {
      const userData = await res.json()
      mutate({
        user: {
          ...user,
          ...userData.user,
        },
      })
      setMsg({ message: 'Profile updated', ...msg })
    } else {
      setMsg({ message: await res.text(), isError: true })
    }
  }

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault()
    const body = {
      oldPassword: e.currentTarget.oldPassword.value,
      newPassword: e.currentTarget.newPassword.value,
    }
    e.currentTarget.oldPassword.value = ''
    e.currentTarget.newPassword.value = ''

    const res = await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 200) {
      setMsg({ message: 'Password updated', ...msg })
    } else {
      setMsg({ message: await res.text(), isError: true, ...msg })
    }
  }

  async function sendVerificationEmail() {
    await fetch('/api/user/email/verify', {
      method: 'POST',
    })
  }

  return (
    <>
      <Style />
      <section>
        <h2>Edit Profile</h2>
        {msg.message ? (
          <p
            style={{
              color: msg.isError ? 'red' : '#0070f3',
              textAlign: 'center',
            }}
          >
            {msg.message}
          </p>
        ) : null}
        <form onSubmit={handleSubmit}>
          {!user.emailVerified ? (
            <p>
              Your email has not been verified. {/* eslint-disable-next-line */}
              <a role="button" onClick={sendVerificationEmail}>
                Send verification email
              </a>
            </p>
          ) : null}
          <label htmlFor="name">
            Name
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
            Bio
            <textarea id="bio" name="bio" placeholder="Bio" ref={bioRef} />
          </label>
          <label htmlFor="avatar">
            Profile picture
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
              ref={profilePictureRef}
            />
          </label>
          <button disabled={isUpdating} type="submit">
            Save
          </button>
        </form>
        <form onSubmit={handleSubmitPasswordChange}>
          <label htmlFor="oldpassword">
            Old Password
            <input
              type="password"
              name="oldPassword"
              id="oldpassword"
              required
            />
          </label>
          <label htmlFor="newpassword">
            New Password
            <input
              type="password"
              name="newPassword"
              id="newpassword"
              required
            />
          </label>
          <button type="submit">Change Password</button>
        </form>
      </section>
    </>
  )
}

export default ProfileSection
