import React from "react";

const page = () => {
  return (
    <div>
      jaskdfj
      <FeedbackEmbed />
    </div>
  );
};

const FeedbackEmbed = () => {
  return (
    <iframe
      title="User Feedback"
      src={`http://localhost:3000/embed/feedback?username=sushil`}
      width="100%"
      height="500"
      style={{ border: "none" }}
      allowFullScreen
    />
  );
};

export default page;
