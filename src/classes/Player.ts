import { Card } from '../_types/interfaces';
import { StateMachine, MachineConfig } from 'xstate';

export default class Player {
  name: string;
  cards: Card[];

  constructor(name?: string) {
    this.name = name ? name : 'Player 1';
    this.cards = [];
  }

  get count() {
    return 5
    // return this.cards.reduce((a, b) => cardTypes[a.value][1]! + cardTypes[b.value][1]!)
  }
}