import React, { useState } from "react";
import { getCards, bestHand } from "../utils";
import Card from "./Card";
import { cms } from "../constant/constant";

const Deck = () => {
  const [randomCards, setRandomCards] = useState(getCards(52, 5));
  const [pokerRanking, setPokerRanking] = useState("");

  const showBestHand = () => {
    setRandomCards(bestHand(randomCards).bestHandCombination);
    setPokerRanking(bestHand(randomCards).ranking);
  };

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        {randomCards.map((card, index) => {
          return <Card card={card} key={index} />;
        })}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => showBestHand()}
          disabled={!!pokerRanking ? true : false}
        >
          {cms.label.showBestHand}
        </button>
        <button
          onClick={() => setRandomCards(getCards(52, 5), setPokerRanking(""))}
        >
          {cms.label.reset}
        </button>
      </div>
      <div>{!!pokerRanking && pokerRanking.toUpperCase()}</div>
    </>
  );
};

export default Deck;
