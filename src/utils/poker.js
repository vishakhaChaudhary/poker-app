import _ from "lodash";
import { constant } from "../constant/constant";

const maxInARow = weights =>
  _.chain(weights)
    .sortBy()
    .uniq()
    .map((num, i) => num - i)
    .groupBy()
    .orderBy(constant.LENGTH)
    .last()
    .value().length;

export class RateableCards {
    constructor(cards) {
      this.ranks = _.groupBy(cards, constant.RANK);
      this.suits = _.groupBy(cards, constant.SUIT);
      this.rankTimes = _.groupBy(this.ranks, constant.LENGTH);
      this.suitTimes = _.groupBy(this.suits, constant.LENGTH);
      this.maxInARow = maxInARow(cards.map(({ weight }) => weight));
    }
  
  
    getOfSameRank(n) {
      return this.rankTimes[n] || [];
    }
  
    getOfSameSuit(n) {
      return this.suitTimes[n] || [];
    }
  
    hasAce() {
      return !!this.ranks["A"];
    }
  
    hasOfSameRank(n) {
      return this.getOfSameRank(n).length;
    }
  
    hasOfSameSuit(n) {
      return this.getOfSameSuit(n).length;
    }
  
    hasInARow(n) {
      return this.maxInARow >= n;
    }
  
    getWorstSingles() {
      return _.chain(this.getOfSameRank(1))
        .flatten()
        .sortBy(constant.WEIGHT)
        .value();
    }
  }