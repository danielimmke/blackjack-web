import { useState } from 'react';
import { assign, createMachine, DelayExpr } from 'xstate';
import { useMachine } from '@xstate/react';
import './App.scss';
import { Card, Suite, Colors } from './_types/interfaces';
import { PlayingCardProps } from './_types/props';

const suiteTypes: Suite[] = ['Diamonds', 'Hearts', 'Spades', 'Clubs'];

const cardTypes: { [key: string]: (string | number)[] } = {
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
  'ACE': ['A', 11],
}

/**
 * Deck
 */
class Deck {
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

/**
 * Shoe
 */
class Shoe {
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

const HeartIcon = () => <g><rect width="150" height="150" fill="none" /><path d="M65.3208292,150 C62.8397499,140.651801 59.2892399,131.839622 54.6692991,123.563465 C50.0493584,115.287307 41.2372491,102.487135 28.2329713,85.1629503 C18.650872,72.4699828 12.7048372,64.3653516 10.3948667,60.8490566 C6.71602501,55.2744425 4.06383679,50.1715266 2.43830207,45.5403087 C0.812767357,40.9090909 0,36.1921097 0,31.3893653 C0,22.4699828 2.95162882,15.0300172 8.85488646,9.06946828 C14.7581441,3.10891938 22.0730503,0.12864494 30.7996052,0.12864494 C39.4406055,0.12864494 46.9693978,3.2161235 53.3859823,9.3910806 C58.2625863,14.1080617 62.2408687,21.0120069 65.3208292,30.1029159 C68.1441264,19.9828473 72.6143468,12.4356775 78.7314906,7.46140652 C84.8486344,2.48713551 91.6288255,0 99.0720633,0 C107.713063,0 115.02797,2.95883362 121.016782,8.87650086 C127.005594,14.7941681 130,21.7838765 130,29.845626 C130,37.135506 128.267522,44.6397941 124.802566,52.3584906 C121.337611,60.077187 114.557421,70.3259005 104.461994,83.1046312 C91.4577162,99.5711836 82.2820007,112.542882 76.934847,122.019726 C71.5876934,131.49657 67.716354,140.823328 65.3208292,150 Z" transform="translate(10, 0)" /></g>
const SpadeIcon = () => <g><rect width="150" height="150" fill="none" /><path d="M59.4971708,0 C61.6147977,8.773355 64.8726852,16.6125102 69.2708334,23.5174655 C73.6689815,30.4224208 81.5082734,38.9723802 92.7887086,49.1673436 C104.069145,59.362307 111.216135,67.2014622 114.229681,72.6848091 C117.243227,78.1681562 118.75,83.7124289 118.75,89.3176281 C118.75,97.0349312 116.14369,103.493095 110.93107,108.69212 C105.71845,113.891145 99.4470164,116.490658 92.1167695,116.490658 C79.4110086,116.490658 69.0264918,108.773355 60.9632202,93.3387492 C61.0446673,105.28026 62.6125257,114.76442 65.6667952,121.791227 C68.7210648,128.818034 73.5875343,134.341998 80.2662039,138.36312 C86.9448734,142.384241 95.8633398,144.760358 107.021605,145.49147 L107.876801,150 L11.1175412,150 L11.9727366,145.49147 C22.0721879,145.49147 30.6445045,143.460601 37.6896863,139.398862 C44.734868,135.337124 50.0696588,129.691308 53.6940587,122.461413 C57.3184585,115.231519 59.0084877,105.523964 58.7641461,93.3387492 C55.0990227,101.056052 50.5583419,106.844029 45.1421039,110.70268 C39.7258659,114.561332 33.6376886,116.490658 26.877572,116.490658 C19.5473251,116.490658 13.235168,113.850528 7.94110086,108.570268 C2.64703361,103.290008 0,97.0349312 0,89.8050367 C0,83.7936641 1.30315501,78.3915516 3.90946502,73.5987002 C7.57458848,66.8562145 13.9681927,59.7887896 23.0902778,52.3964257 C34.4928841,43.0544273 43.329904,33.7530463 49.6013374,24.4922827 C54.16238,17.7497969 57.4609911,9.58570266 59.4971708,0 Z" transform="translate(15, 0)" /></g>
const DiamondIcon = () => <g><rect width="150" height="150" fill="none" /><path d="M54.7587719,0 C61.9152047,12.1187801 71.0416666,25.5617977 82.1381575,40.329053 C93.2346494,55.0963082 102.52193,66.6131621 110,74.8796149 C103.888889,81.2199037 94.1593568,93.3386837 80.8114038,111.235955 C69.875731,125.842697 61.2317252,138.764045 54.8793859,150 C52.7887427,145.987159 50.0146198,141.41252 46.5570175,136.276083 C40.4459064,127.207063 32.5657895,116.252006 22.9166666,103.410915 C20.5043859,100.200642 12.8654971,90.6902084 0,74.8796149 C8.12134502,65.6500803 18.494152,52.6083467 31.1184211,35.7544141 C40.5263158,23.2343499 48.4064327,11.3162119 54.7587719,0 Z" transform="translate(20, 0)" /></g>
const ClubIcon = () => <g><rect width="150" height="150" fill="none" /><path d="M127.579592,150.630204 L23.7902041,150.630204 L24.7763265,146.439184 C38.3355102,143.562993 47.2927891,140.76898 51.6481633,138.057143 C58.3044898,133.866122 63.7281633,127.682313 67.9191837,119.505714 C72.1102041,111.329116 74.2057143,102.762177 74.2057143,93.804898 C74.2057143,92.5722449 74.1235374,90.6821769 73.9591837,88.1346939 C69.1107483,98.1602721 63.0912925,105.515102 55.9008163,110.199184 C48.7103401,114.883265 41.4171429,117.225306 34.0212245,117.225306 C24.4887075,117.225306 16.4353741,113.917687 9.86122449,107.302449 C3.28707483,100.687211 0,92.5722449 0,82.957551 C0,73.5072109 3.02,65.5155102 9.06,58.982449 C15.1,52.4493878 21.9001361,49.1828571 29.4604082,49.1828571 C34.4731973,49.1828571 41.1706122,51.2783673 49.5526531,55.4693878 C46.1012245,49.8813605 43.8619048,45.6081633 42.8346939,42.6497959 C41.807483,39.6914286 41.2938776,36.527619 41.2938776,33.1583673 C41.2938776,23.872381 44.5193197,16.0244898 50.9702041,9.61469388 C57.4210884,3.20489796 65.494966,2.84217094e-14 75.1918367,2.84217094e-14 C84.8065306,2.84217094e-14 92.8804082,3.22544218 99.4134694,9.67632653 C105.946531,16.1272109 109.213061,23.8312925 109.213061,32.7885714 C109.213061,40.0201361 106.419048,47.5804082 100.83102,55.4693878 C107.733878,52.2644898 111.842721,50.4565986 113.157551,50.0457143 C115.376327,49.3882993 117.882721,49.0595918 120.676735,49.0595918 C128.894422,49.0595918 136.002721,52.2644898 142.001633,58.6742857 C148.000544,65.0840816 151,73.0141497 151,82.4644898 C151,92.2435374 147.712925,100.461224 141.138776,107.117551 C134.564626,113.773878 126.634558,117.102041 117.348571,117.102041 C112.335782,117.102041 107.097007,115.869388 101.632245,113.404082 C96.167483,110.938776 91.4217687,107.610612 87.395102,103.419592 C84.5189116,100.461224 80.9853061,95.3662585 76.7942857,88.1346939 C77.1229932,101.118639 79.0952381,111.390748 82.7110204,118.95102 C86.3268027,126.511293 91.9148299,132.756735 99.475102,137.687347 C104.487891,140.974422 113.527347,143.891701 126.593469,146.439184 L127.579592,150.630204 Z"/></g>

const iconDict: { [key: string]: any } = {
  Clubs: <ClubIcon />,
  Diamonds: <DiamondIcon />,
  Hearts: <HeartIcon />,
  Spades: <SpadeIcon />
}

const PlayingCard = ({ card, faceDown = false, width = 500, height = 750, style = {} }:PlayingCardProps) => {
  if(faceDown) return (
    <svg viewBox={`0 0 ${width} ${height}`} className="playing-card hidden" fill="#2C65F5" style={style}>
      <defs>
        <pattern id="autumn" x="-10" y="5" width="88" height="24" patternUnits="userSpaceOnUse">
          <path d="M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z" />
        </pattern>
      </defs>
      <rect width={width} height={height} rx="20" ry="20" fill="#fff" />
      <rect width={width - 40} height={height - 40} transform="translate(20, 20)" fill={`url(#autumn)`} rx="10" ry="10" stroke="#2C65F5" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  )

  const { value, suite } = card;

  let fillColor = ['Spades', 'Clubs'].includes(suite) ? Colors.Black : Colors.Red;
  let label = cardTypes[value][0];

  let Icon = () => iconDict[suite]

  let offsets: { [key:string] : number } = {
    TEN: -14,
    QUEEN: -3,
    KING: -3,
    ACE: -1,
    JACK: 10
  }

  let xPos = offsets[value] ? offsets[value] : 3;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="playing-card" fill={fillColor} style={style}>
      <rect width={width} height={height} rx="20" ry="20" fill="#FFF" stroke="rgba(0,0,0,.3)" strokeWidth="3" strokeLinejoin="round" />
      <g>
        <g transform="translate(48 18)">
          <g transform="translate(-5 110) scale(0.4)">
            <Icon />
          </g>
          <text fontFamily="Fraunces-SemiBold, Fraunces" fontSize="90" fontWeight="500">
            <tspan x={xPos} y={88}>{label}</tspan>
          </text>
        </g>
        <g transform="rotate(-180 224 354.5)">
          <g transform="translate(-5 110) scale(0.4)">
            <Icon />
          </g>
          <text fontFamily="Fraunces-SemiBold, Fraunces" fontSize="90" fontWeight="500">
            <tspan x={xPos} y={88}>{label}</tspan>
          </text>
        </g>
        <g transform="translate(175, 275)">
          <Icon />
        </g>
      </g>
    </svg>
  )
}
class Player {
  name: string;
  cards: Card[]

  constructor(name?: string) {
    this.name = name ? name : 'Player 1'
    this.cards = []
  }

  get count() {
    return 5
    // return this.cards.reduce((a, b) => cardTypes[a.value][1]! + cardTypes[b.value][1]!)
  }
}

const dealCards = ({players, dealer, shoe}: {players: Player[], dealer: Player, shoe: Shoe}) => {
  for(let player of [...players, dealer]) {
    player.cards.push( shoe.draw()! )
  }
  for(let player of [...players, dealer]) {
    player.cards.push( shoe.draw()! )
  }
}

const stateMachine = createMachine(
  {
    id: 'blackjack',
    initial: 'placeBets',
    context: {
      shoe: new Shoe(),
      players: [new Player('Dan'), new Player('Juan')],
      dealer: new Player()
    },
    states: {
      placeBets: {
        on: {
          BEGIN_ROUND: {
            target: 'player',
            actions: ['dealCards']
          }
        }
      },
      player: {
        on: {
          HIT: {
            actions: ['drawCard']
          },
          BUST: 'dealer',
          STAY: 'dealer'
        }
      },
      dealer: {
        on: { BUST: 'endRound', STAY: 'endRound'}
      },
      endRound: {
        on: { NEW_ROUND: 'placeBets'}
      }
    }
  },
  {
    actions: {
      dealCards,
      drawCard: () => console.log('drawing a card')
    }
  }
);

function App() {
  const [state, send] = useMachine(stateMachine);

  const { players, dealer, shoe }: { players: Player[], dealer: Player, shoe: Shoe } = state.context;

  const PlayerSpot = ({player} : {player: Player}) => {
    const hasCards = player.cards.length > 0

    return (
      <div className="player-spot">
        {hasCards && (<div className="card-list overlapping">
          {player.cards.map((card, idx: number) => <PlayingCard card={card} style={idx > 0 ? {left: `${1.5 * idx * -1}em`, top: `${-.5 * idx}em`} : {}} />)}
        </div>)}

        {/* Background */}
        <svg viewBox="0 0 500 750" className="player-spot-placeholder">
          <rect width={490} height={740} x="5" y="5" fill="#0F3A1E" stroke="#D2DAD5" strokeWidth="10" rx="30"/>
        </svg>
        <span className="player-name">{player.name}</span>
      </div>
    )
  }

  return (
    <div className="App">
      <header>
        <div className="controls" style={{float: 'left'}}>
          <span onClick={() => send('BEGIN_ROUND')} style={{textDecoration: 'underline', cursor: 'pointer'}}>Begin Round</span><br />
          Current State: ${state.value}
        </div>
        <h1>Blackjack</h1>
        <div className="information">
          Cards remaining in Shoe: {shoe.remaining}&nbsp;&nbsp;&nbsp;<br />
          Number of decks: 6
        </div>
      </header>
      <main>
        <section className="dealer-spot">
          <div className="dealer-cards">
           {dealer.cards?.map((card, idx) => <PlayingCard card={card} faceDown={idx === 0} />)}
          </div>
        </section>
        <section className="player-spots">
          {players.map((player, idx) => <PlayerSpot player={player} key={player.name + idx} />)}
        </section>
      </main>
    </div>
  );
}

export default App;
