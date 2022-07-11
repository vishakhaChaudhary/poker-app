import React from "react";

const Card = (props) => {
  const { rank, suit } = props.card;
  return (
    <div
      style={{
        width: "200px",
        height: "300px",
        padding: "10px",
        border: "3px solid black",
        display: "inline",
      }}
    >
      {`${rank} - ${suit}`}
    </div>
  );
};

export default Card;
