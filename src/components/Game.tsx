import * as React from 'react';
import update from 'immutability-helper';
import Animal from './Animal';
import Card from './Card';

import './Game.scss';
import { cards } from '../resources/Cards';

interface GameProps {
    title: string;
}

interface GameState {
    playersTurn: boolean;
    player: Animal[];
    computer: Animal[];
    selectedProperty: string;
    computerUncovered: boolean;
}

export default class Game extends React.Component<GameProps, GameState> {
    static defaultProps = {
        title: 'Supertrumpf',
    };

    constructor(props: GameProps) {
        super(props);

        const cards = this.getRandomCards();

        this.state = {
            playersTurn: true,
            player: cards.slice(0, cards.length / 2),
            computer: cards.slice(cards.length / 2, cards.length),
            selectedProperty: '',
            computerUncovered: false,
        };
    }

    private restartGame() {
        const cards = this.getRandomCards();

        this.setState({
            ...this.state,
            playersTurn: true,
            player: cards.slice(0, cards.length / 2),
            computer: cards.slice(cards.length / 2, cards.length),
            selectedProperty: '',
            computerUncovered: false,
        });
    }

    private play(property: string) {
        this.setState(
            (state) =>
                update(state, {
                    selectedProperty: { $set: property },
                    computerUncovered: { $set: true },
                }),
            () => {
                setTimeout(() => {
                    this.compare(property);
                }, 2000);
            },
        );
    }

    private getSelectedPropertyHandler() {
        return (property: string) => this.play(property);
    }

    compare(propertyName: string) {
        let playersTurn = this.state.playersTurn;
        const firstPlayer = this.state.player[0];
        // remove one item from array starting from position one
        let playerAnimal = update(this.state.player, { $splice: [[0, 1]] });
        const firstComputer = this.state.computer[0];
        // remove one item from array starting from position one
        let computerAnimal = update(this.state.computer, { $splice: [[0, 1]] });
        const playerPropValue = firstPlayer[propertyName];
        const computerPropValue = firstComputer[propertyName];
        if (playerPropValue > computerPropValue) {
            playersTurn = true;
            // add computer card to player cards
            playerAnimal = update(playerAnimal, { $push: [firstPlayer, firstComputer] });
            if (computerAnimal.length === 0) {
                alert('Player wins!');
                this.restartGame();
                return;
            }
        } else if (playerPropValue < computerPropValue) {
            playersTurn = false;
            // add player card to computer cards
            computerAnimal = update(computerAnimal, { $push: [firstPlayer, firstComputer] });
            if (playerAnimal.length === 0) {
                alert('Computer wins!');
                this.restartGame();
                return;
            }
        } else {
            // add the card of each player back to their deck
            playerAnimal = update(playerAnimal, { $push: [firstPlayer] });
            computerAnimal = update(computerAnimal, { $push: [firstComputer] });
        }
        this.setState(
            (state) =>
                update(state, {
                    $set: {
                        computerUncovered: false,
                        selectedProperty: '',
                        playersTurn,
                        player: playerAnimal,
                        computer: computerAnimal,
                    },
                }),
            () => {
                if (!playersTurn) {
                    setTimeout(() => {
                        const property = this.selectRandomProperty();
                        this.play(property);
                    }, 2000);
                }
            },
        );
    }

    private getRandomCards(): Animal[] {
        const retCards: Animal[] = [...cards];
        for (let i = retCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [retCards[i], retCards[j]] = [retCards[j], retCards[i]];
        }
        return retCards;
    }

    private selectRandomProperty(): string {
        const properties = Object.keys(Animal.properties);
        const index = Math.floor(Math.random() * properties.length);
        return properties[index];
    }

    render() {
        const { player, computer, playersTurn, selectedProperty, computerUncovered } = this.state;
        return (
            <div>
                <h1>{this.props.title}</h1>
                <div className='info'>{playersTurn ? 'Du bist' : 'Der Computer ist'} an der Reihe</div>
                <div className='cards'>
                    <Card
                        animal={player[0]}
                        uncovered={true}
                        selectedProperty={selectedProperty}
                        onSelectProperty={this.getSelectedPropertyHandler().bind(this)}
                    />
                    <Card
                        animal={computer[0]}
                        uncovered={computerUncovered}
                        selectedProperty={selectedProperty}
                    />
                </div>
            </div>
        );
    }
}
