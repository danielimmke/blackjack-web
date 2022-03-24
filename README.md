Original goal of this was to create a simple Blackjack app. I got basic game logic/state machines working, but I lack the time/interest to flesh this out into a fully working game.

Jotting this down in case I ever pick it back up.

Roadmap:
Bug: First ace always is 11, even when that makes the count go over [Potentially fixed?]
Bug: Dealer should have a guard to check for >= 17 before begin hitting
Bug: Players should have a guard to check for 21 - add status "Blackjack" and auto end turn
Dynamic positioning of cards for players depending on how many there are
Animated dealing / hitting
Advanced features (betting, surrender, insurance, doubling etc...) [Maybe]