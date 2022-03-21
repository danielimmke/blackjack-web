import { Card } from '../_types/interfaces';
import Deck from './Deck';

/**
 * Shoe
 */
 export default class Shoe {
  private list: Card[];
  private numDecks: number;

  constructor(numDecks: number = 6) {
    this.list = [];
    this.numDecks = numDecks;

    for(let i = 0; i < this.numDecks; i++) {
      let deck = new Deck();
      this.list = this.list.concat(deck.list);
    }
  }

  draw() {
    return this.list.pop();
  }

  public get remaining() {
    return this.list.length;
  }
}