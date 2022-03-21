import { Card, cardTypes } from '../_types/interfaces';

export default class Player {
  name: string;
  cards: Card[];

  constructor(name?: string) {
    this.name = name ? name : 'Player 1';
    this.cards = [];
  }

  get count() {
    let res = 0;
    
    this.cards.forEach(card => {
      // if(card.value === 'ACE')
      res += cardTypes[card.value][1]
    })

    return res;
  }
}