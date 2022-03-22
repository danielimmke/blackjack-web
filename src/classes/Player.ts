import { Card, cardTypes } from '../_types/interfaces';

export default class Player {
  name: string;
  cards: Card[];
  isDealer?: boolean;
  status?: string;

  constructor(name?: string, isDealer?: boolean) {
    this.name = name ? name : 'Player 1';
    this.cards = [];
    if(isDealer) this.isDealer = isDealer
  }

  // Only one Ace can count as 11 in a blackjack hand
  get count() {
    let res = 0;

    let aceUsed = false;
    
    this.cards.forEach(card => {
      if(card.value === 'ACE' && aceUsed === false) {
        aceUsed = true;
        res += 11;
        return
      }

      res += cardTypes[card.value][1]
    })

    if(res > 21 && aceUsed) {
      res -= 10
      aceUsed = false
    }

    return res;
  }
}