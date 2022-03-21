import Player from '../classes/Player';
import Deck from '../classes/Deck';
import Shoe from '../classes/Shoe';

export type Suite = 'Diamonds' | 'Hearts' | 'Spades' | 'Clubs';

export const suiteTypes: Suite[] = ['Diamonds', 'Hearts', 'Spades', 'Clubs'];

/**
 * Cards can only be red and black
 */
export enum Colors {
  Black = '#000000',
  Red = '#F00'
}

export interface Card {
  value: string;
  suite: Suite;
}

export interface Round {

}

export const cardTypes: { [key: string]: [string, number] } = {
  'TWO': ['2', 2],
  'THREE': ['3', 3],
  'FOUR': ['4', 4],
  'FIVE': ['5', 5],
  'SIX': ['6', 6],
  'SEVEN': ['7', 7],
  'EIGHT': ['8', 8],
  'NINE': ['9', 9],
  'TEN': ['10', 10],
  'JACK': ['J',10],
  'QUEEN': ['Q',10],
  'KING': ['K',10],
  'ACE': ['A', 1],
}

export interface contextSchema {
  shoe: Shoe;
  currentPlayer: number;
  players: Player[];
  dealer: Player;
}

export interface PlayerState {
  players: Player[];
  currentPlayer: number;
}