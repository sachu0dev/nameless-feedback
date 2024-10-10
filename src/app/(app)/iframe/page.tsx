"use client";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  return (
    <div>
      <FeedbackEmbed />
    </div>
  );
};

const FeedbackEmbed = () => {
  const { data: session } = useSession();
  if (!session || !session.user) return <div>Please login</div>;

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const embedUrl = `${baseUrl}/api/embed?username=${username}`;
  return (
    <iframe
      title="User Feedback"
      src={`${embedUrl}`}
      width="100%"
      height="500"
      style={{ border: "none", background: "transparent" }}
      allowFullScreen
    />
  );
};

export default page;
