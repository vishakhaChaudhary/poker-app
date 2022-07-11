import _ from "lodash";
import { RANKS, SUITS, constant } from "../constant/constant";
import { RateableCards } from "./poker";

const PokerRating = {
  StraightFlush: (hand) => hand.hasInARow(5) && hand.hasOfSameSuit(5),
  FourOfAKind: (hand) => hand.hasOfSameRank(4),
  FullHouse: (hand) => hand.hasOfSameRank(3) && hand.hasOfSameRank(2),
  Flush: (hand) => hand.hasOfSameSuit(5),
  Straight: (hand) => hand.hasInARow(5),
  ThreeOfAKind: (hand) => hand.hasOfSameRank(3),
  TwoPair: (hand) => hand.hasOfSameRank(2) >= 2,
  OnePair: (hand) => hand.hasOfSameRank(2),
  HighCard: (hand) => hand.hasOfSameRank(1) >= 5,
};

/**
 * @desc Deck of 52 cards
 */

const Cards = Object.entries(RANKS).reduce(
  (cards, [weight, rank]) => [
    ...cards,
    ...SUITS.map((suit) => ({ rank, suit, weight })),
  ],
  []
);

/**
 * @desc Method to get the five random cards
 * @param {*} max total number of cards
 * @param {*} n number of cards to dispaly
 * @returns uniqueCards Array of random cards
 */

const getCards = (max = 52, n = 5) => {
  const uniqueCards = [];
  const randomIntValue = [];
  for (let i = 1; i <= n; i++) {
    const cardIndex = getUniqueRandomInt(max, randomIntValue);
    uniqueCards.push(Cards[cardIndex]);
    randomIntValue.push(cardIndex);
  }

  return uniqueCards;
};

/**
 * @desc Method to generate the five random unique cards
 * @param {*} max total number cards
 * @param {*} passed array includes the index of the list of cards
 * @returns num the index of the card
 */

const getUniqueRandomInt = (max, passed) => {
  const num = Math.floor(Math.random() * Math.floor(max));

  if (_.includes(passed, num)) {
    return getUniqueRandomInt(max);
  }

  return num;
};

/**
 * @desc Method to find the poker hand ranking
 * @param {*} cards 
 * @returns poker hand ranking
 */

const PokerHandRate = (cards) => {
  return Object.entries(PokerRating).find(([, is]) => is(cards))[0];
};

/**
 * @desc Method to filter the player cards on the basis of weight
 * @param {*} cards array of player cards r1-r5
 * @param {*} length length of the cards
 * @param {*} elementToExclude eleminate the card weight which already included
 * @returns value 
 */

const filterPlayerCardsOnWeight = (cards, length, elementToExclude = null) => {
  const data = _.groupBy(cards, constant.WEIGHT);
  for (const [key, value] of Object.entries(data)) {
    if (value.length === length && key !== elementToExclude) {
      return value;
    }
  }

  return cards;
};

/**
 * @desc Method to find out the best possible combination of the cards
 * @param {*} ranking Type of the poker rank
 * @param {*} playerCards Array of random cards r1-r5
 * @returns the possible best pair of cards
 */
const bestResultCombination = (ranking, playerCards) => {
  if (
    ranking === constant.STRAIGHT_FLUSH ||
    ranking === constant.FULL_HOUSE ||
    ranking === constant.FLUSH ||
    ranking === constant.STRAIGHT
  ) {
    return playerCards;
  }

  if (ranking === constant.HIGHH_CARD) {
    return [
      playerCards.reduce(
        (prevVal, currentVal) => {
          if (Number(currentVal.weight) >= Number(prevVal.weight)) {
            return currentVal;
          }
          return prevVal;
        },
        { weight: 0 }
      ),
    ];
  }

  if (ranking === constant.FOUR_OF_A_KIND) {
    return filterPlayerCardsOnWeight(playerCards, 4);
  }

  if (ranking === constant.THREE_OF_A_KIND) {
    return filterPlayerCardsOnWeight(playerCards, 3);
  }

  if (ranking === constant.TWO_PAIR) {
    const firstTwoPair = filterPlayerCardsOnWeight(playerCards, 2);
    const secondTwoPair = filterPlayerCardsOnWeight(
      playerCards,
      2,
      firstTwoPair[0].weight
    );

    return [...firstTwoPair, ...secondTwoPair];
  }

  if (ranking === constant.ONE_PAIR) {
    return filterPlayerCardsOnWeight(playerCards, 2);
  }

  return playerCards;
};

/**
 * @desc Method to find the poker hand ranking and best hand combination from the player cards
 * @param {*} playerCards 
 * @returns { ranking, bestHandCombination }
 */

const bestHand = (playerCards) => {
  const ranking = String(PokerHandRate(new RateableCards(playerCards)));
  const bestHandCombination = bestResultCombination(ranking, playerCards);
  return {
    ranking,
    bestHandCombination,
  };
};

export {
  getCards,
  bestHand
}
