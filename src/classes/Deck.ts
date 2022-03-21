import { Card, cardTypes, suiteTypes } from '../_types/interfaces';
// import { Card, Suite, Colors, cardTypes, suiteTypes } from './_types/interfaces';
/**
 * Deck
 */
 export default class Deck {
  list: Card[]

  constructor() {
    this.list = this.create();

    this.shuffle();
  }

  create() {
    let list: Card[] = [];

    for(let suite of suiteTypes) {
      for(let value in cardTypes) {
        const card: Card = {
          value,
          suite
        }

        list.push(card);
      }
    }

    return list;
  }

  // Fisher-Yates shuffle algorithm
  shuffle(cards: Card[] = this.list) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
}