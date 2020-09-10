import React from "react";
import Head from "next/head";
import Link from "next/link";
import Error from "next/error";
import middleware from "../../../middlewares/middleware";
import { useCurrentUser } from "../../../lib/hooks";
import { getUser } from "../../../lib/db";

export default function UserPage({ user }) {
  if (!user) return <Error statusCode={404} />;
  const { name, email, bio, profilePicture, picks } = user || {};
  const [currentUser] = useCurrentUser();
  const isCurrentUser = currentUser?._id === user._id;
  return (
    <>
      <style jsx>
        {`
          h2 {
            text-align: left;
            margin-right: 0.5rem;
          }
          img {
            width: 10rem;
            height: auto;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 1px;
            margin-right: 1.5rem;
            background-color: #f3f3f3;
          }
          p {
            font-family: monospace;
            color: #444;
            margin: 0.25rem 0 0.75rem;
          }
          a {
            margin-left: 0.25rem;
          }
          .page-content .user-info {
            display: flex;
            align-items: center;
            max-width: 800px;
            margin: auto;
            padding: 1rem;
            background-color: #1b309442;
          }
          .user-info section {
            width: 100%;
          }
          .user-info button {
            float: right;
            margin: 0 0.25rem;
          }
        `}
      </style>
      <Head>
        <title>FWS | {name}</title>
      </Head>

      <main id="account" className="account">
        <header className="page-header">
          <h1 className="hero">My Account</h1>
        </header>
        <div className="page-content">
          <div className="user-info">
            <img src={profilePicture} width="256" height="256" alt={name} />
            <section>
              <div>
                <h2>{name}</h2>
              </div>
              Bio
              <p>{bio}</p>
              Email
              <p>{email}</p>
              {isCurrentUser && (
                <Link href="/settings">
                  <button type="button">Edit Account</button>
                </Link>
              )}
            </section>
          </div>
          <div>
            <h3>My Record:</h3>
          </div>
        </div>

        <div className="page-footer"></div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  await middleware.apply(context.req, context.res);
  const user = await getUser(context.req, context.params.userId);
  if (!user) {
    context.res.statusCode = 404;
  } else {
    user.picks = JSON.stringify(user.picks); // Please only return JSON serializable data types.
  }
  return {
    props: {
      user,
    }, // will be passed to the page component as props
  };
}
