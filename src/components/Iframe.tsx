import React from "react";

const FeedbackEmbed = ({ username }: { username: string }) => {
  return (
    <iframe
      title="User Feedback"
      src={`http://localhost:3000/embed/feedback?username=${username}`}
      width="100%"
      height="500"
      style={{ border: "none" }}
      allowFullScreen
    />
  );
};

export default FeedbackEmbed;
