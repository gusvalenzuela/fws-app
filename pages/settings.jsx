import React from "react";
import ProfileSection from "../components/ProfileSection";
import { useCurrentUser } from "../lib/hooks";
const SettingPage = () => {
  const [user] = useCurrentUser();

  if (!user) {
    return (
      <>
        <p>Please sign in</p>
      </>
    );
  }
  return (
    <>
      <h1>Settings</h1>
      <ProfileSection />
    </>
  );
};

export default SettingPage;
