import { useEffect } from 'react';
import { assign, createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';
import './App.scss';

import { contextSchema, PlayerState } from './_types/interfaces';

import Shoe from './classes/Shoe';

import PlayingCard from './components/PlayingCard';

import Player from './classes/Player';

const { send } = actions;

const dealCards = ({players, dealer, shoe}: {players: Player[], dealer: Player, shoe: Shoe}) => {
  for(let player of players) {
    player.cards.push( shoe.draw()! )
  }
  for(let player of players) {
    player.cards.push( shoe.draw()! )
  }
}

const drawCard = assign({
  players: (context: any) => {
    context.players[context.currentPlayer].cards.push(context.shoe.draw());

    return context.players;
  }
});

const takeCards = assign({
  players: (context: any) => {
    context.players[context.currentPlayer].cards = [];

    return context.players;
  }
});

const setBustedStatus = assign({
  players: (context: any) => {
    context.players[context.currentPlayer].status = 'busted';

    return context.players;
  }
});

const calculateResults = assign({
  players: (context: any) => {
    let dealerCount = context.players[0].count;

    if(dealerCount > 21) {
      for(let i = 1; i < context.players.length; i++) {
        if('busted' === context.players[i].status) {
          context.players[i].status = 'Lose'
        } else {
          context.players[i].status = 'Win!'
        }
      }

      return context.players;
    }

    for(let i = 1; i < context.players.length; i++) {
      if(context.players[i].count > dealerCount) {
        context.players[i].status = 'Win!'
      } else if(context.players[i].count === dealerCount) {
        context.players[i].status = 'Push'
      } else {
        context.players[i].status = 'Lose'
      }
    }

    context.players[context.currentPlayer].cards = [];

    return context.players;
  }
});

const incrementPlayer = assign({
    currentPlayer: ({currentPlayer}: {currentPlayer: number}) => currentPlayer + 1
})

const dealerStartCheck = () => send('HIT')

const samplePlayers = [new Player('Dealer', true), new Player('Dan'), new Player('Juan')];

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
          currentPlayer: null
        }),
        always: 'placeBets'
      },
      placeBets: { // TODO
        on: {
          BEGIN_ROUND: [
            {target: 'dealingCards'}
          ]
        }
      },
      dealingCards: {
        entry: [
          dealCards,
          assign({currentPlayer: () => 1})
        ],
        always: 'playerTurn'
      },
      playerTurn: {
        id: 'Player Turn',
        initial: 'notBusted',
        states: {
          notBusted: {
            on: {
              HIT: {
                actions: drawCard,
              },
              STAY: "stay",
            },
            always: [
              {
                target: 'bust',
                cond: 'tooHigh', // Bust if they go higher than 21
              },
              {
                target: 'stay',
                cond: 'exactlyTwentyOne', // Automatically end turn if they hit to 21
              },
            ]
          },
          stay: {
            type: "final"
          },
          bust: {
            type: "final",
            entry: [takeCards, setBustedStatus]
          }
        },
        onDone: [
          {
            actions: incrementPlayer,
            target: 'playerTurn',
            cond: 'remainingPlayers',
          },
          {
            target: 'dealerTurn'
          },
        ]
      },
      dealerTurn: {
        id: 'Dealer Turn',
        initial: 'notBusted',
        entry: [assign({currentPlayer: () => 0}), send('HIT')],
        states: {
          notBusted: {
            on: {
              HIT: {
                actions: [drawCard, send('HIT')],
              }
            },
            always: [
              {
                target: 'bust',
                cond: 'tooHigh', // Bust if they go higher than 21
              },
              {
                target: 'stay',
                cond: 'seventeenOrHigher', // Automatically stay if the count is 17 or higher
              },
            ]
          },
          stay: {
            type: "final"
          },
          bust: {
            type: "final",
          }
        },
        onDone: {
          target: 'endRound',
        }
      },
      endRound: {
        type: "final",
        entry: calculateResults
        // TODO: Auto start a new round?
      }
    }
  },
  {
    actions: {
      dealCards,
      drawCard,
      takeCards,
      setBustedStatus,
      dealerStartCheck
    },
    guards: {
      seventeenOrHigher: ({players, currentPlayer}: PlayerState) => players[currentPlayer].count >= 17,
      exactlyTwentyOne: ({players, currentPlayer}: PlayerState) => players[currentPlayer].count === 21,
      tooHigh: ({players, currentPlayer}: PlayerState) => players[currentPlayer].count > 21,
      remainingPlayers: ({players, currentPlayer}: PlayerState) => (currentPlayer < players.length - 1)
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

  const { players, shoe, currentPlayer }: { players: Player[], shoe: Shoe, currentPlayer: number } = state.context;

  const PlayerSpot = ({player, idx} : {player: Player, idx: number}) => {
    if(player.isDealer) return null;

    const hasCards = player.cards.length > 0
    const classes = ['player-spot'];

    const activePlayer = (idx === currentPlayer);

    if(activePlayer) classes.push('active');

    const playerMetaData = () => {
      if(state.matches('placeBets')) return null

      if(player.status) return '— ' + player.status

      if(hasCards) return player.count
    }


    return (
      <div className={classes.join(' ')}>
        {hasCards && (<div className="card-list overlapping">
          {player.cards.map((card, idx: number) => <PlayingCard card={card} style={idx > 0 ? {left: `${1.5 * idx * -1}em`, top: `${-.5 * idx}em`} : {}} />)}
        </div>)}
        {/* Player actions */ }
        <ul className="player-actions">
          <button onClick={() => send('HIT')} disabled={!activePlayer}>Hit</button>
          <button onClick={() => send('STAY')} disabled={!activePlayer}>Stay</button>
        </ul>
        {/* Background */}
        <svg viewBox="0 0 500 750" className="player-spot-placeholder">
          <rect width={490} height={740} x="5" y="5" fill="#0F3A1E" stroke="#D2DAD5" strokeWidth="10" rx="30"/>
        </svg>
        <span className="player-name">{player.name} {playerMetaData()}</span>
      </div>
    )
  }

  return (
    <div className="App">
      <header>
        <div className="controls" style={{float: 'left'}}>
          <span onClick={() => send('BEGIN_ROUND')} style={{textDecoration: 'underline', cursor: 'pointer'}}>Begin Round</span><br />
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
           {players[0].cards?.map((card, idx) => <PlayingCard card={card} faceDown={idx === 0 && false === state.matches('dealerTurn') && false === state.matches('endRound')} />)}
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
