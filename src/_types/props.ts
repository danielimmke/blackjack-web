import { Card } from './interfaces';

export interface IconProps {
  width?: number;
}

export interface PlayingCardProps {
  card: Card;
  faceDown?: boolean;
  width?: number;
  height?: number;
}