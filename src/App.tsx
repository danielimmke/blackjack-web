import { useEffect } from 'react';
import { assign, createMachine } from 'xstate';
import { useMachine } from '@xstate/react';
import './App.scss';

import { contextSchema } from './_types/interfaces';

import Shoe from './classes/Shoe';

import PlayingCard from './components/PlayingCard';

import Player from './classes/Player';

const dealCards = ({players, dealer, shoe}: {players: Player[], dealer: Player, shoe: Shoe}) => {
  for(let player of [...players, dealer]) {
    player.cards.push( shoe.draw()! )
  }
  for(let player of [...players, dealer]) {
    player.cards.push( shoe.draw()! )
  }
}

const drawCard = ({ shoe, players, currentPlayer }: { shoe: Shoe, players: Player[], currentPlayer: number}) => {
  let newPlayers = [...players];

  players[currentPlayer].cards.push(shoe.draw()!);

  assign({
    players: newPlayers
  })
}

const incrementPlayer = assign({
    currentPlayer: ({currentPlayer}: {currentPlayer: number}) => currentPlayer + 1
})

const samplePlayers = [new Player('Dan'), new Player('Juan')];

const stateMachine = createMachine(
  {
    schema: {
      context: {} as contextSchema
    },
    id: 'Round of Blackjack',
    initial: 'loading',
    states: {
      loading: {
        entry: assign({
          shoe: new Shoe(),
          players: samplePlayers,
          dealer: new Player('Dealer'),
          currentPlayer: 0
        }),
        always: 'placeBets'
      },
      placeBets: { // TODO
        always: 'dealingCards', 
      },
      dealingCards: {
        entry: dealCards,
        always: 'playerTurn'
      },
      playerTurn: {
        id: "Player Turn",
        initial: "notBusted",
        states: {
          'notBusted': {
            on: {
              HIT: [
                {
                  actions: drawCard
                },
                {
                  target: "bust",
                  cond: { type: "tooHigh" },
                  
                },
                {
                  target: "stay",
                  cond: { type: "exactlyTwentyOne" },
                }
              ],
              STAY: "stay",
            },
          },
          stay: {
            type: "final",
          },
          bust: {
            type: "final",
          },
        },
        onDone: {
          actions: [incrementPlayer],
          target: 'playerTurn'
        }
      },
      dealerTurn: { // TODO
        entry: () => console.log('Dealer turn'),
        always: 'endRound'
      },
      endRound: {
        type: "final",
        entry: ['calculateWin']
        // TODO: Auto start a new round
      }
    }
  },
  {
    actions: {
      dealCards,
      drawCard,
      calculateWin: () => console.log('Round is over')
    },
    guards: {
      exactlyTwentyOne: () => true,
      tooHigh: () => true,
    },
  }
);

function App() {
  const [state, send, service] = useMachine(stateMachine);

useEffect(() => {
const subscription = service.subscribe(state => console.log(state));
return subscription.unsubscribe;
}, [service]);


  if(state.matches('loading')) return null;

  const { players, dealer, shoe, currentPlayer }: { players: Player[], dealer: Player, shoe: Shoe, currentPlayer: number } = state.context;

  const PlayerSpot = ({player, idx} : {player: Player, idx: number}) => {
    const hasCards = player.cards.length > 0
    const classes = ['player-spot'];

    if(idx === currentPlayer) classes.push('active');

    return (
      <div className={classes.join(' ')}>
        {hasCards && (<div className="card-list overlapping">
          {player.cards.map((card, idx: number) => <PlayingCard card={card} style={idx > 0 ? {left: `${1.5 * idx * -1}em`, top: `${-.5 * idx}em`} : {}} />)}
        </div>)}
        {/* Player actions */ }
        <ul className="player-actions">
          <button onClick={() => send('HIT')}>Hit</button>
          <button onClick={() => send('STAY')}>Stay</button>
        </ul>
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
          {/* Current State: ${state.value} */}
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
          {players.map((player, idx) => <PlayerSpot player={player} idx={idx} key={player.name + idx} />)}
        </section>
      </main>
    </div>
  );
}

export default App;
