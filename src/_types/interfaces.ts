export type Suite = 'Diamonds' | 'Hearts' | 'Spades' | 'Clubs';

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