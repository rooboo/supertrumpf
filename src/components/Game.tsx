import * as React from 'react';
import update from 'immutability-helper';
import Animal from './Animal';

import './Game.scss';
import { CardType } from '../types';

// Lazy loading of Card component. With this feature, we reduce initial bundle size.
// The Card component is bundled in another chunk, which is loaded on demand.
const Card = React.lazy(() => {
    //simulate slow network by executing the resolve function with a delay, before importing the component
    return new Promise((resolve) => setTimeout(resolve, 2 * 1000)).then(() => import('./Card'));
});

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

        this.state = {
            playersTurn: true,
            player: [],
            computer: [],
            selectedProperty: '',
            computerUncovered: false,
        };
    }

    /**
     * After mounting the component, we fetch the cards from another local json-server (via npm install json-server), which serves the cards.json.
     * After that we push the shuffled cards into the play and computer props.
     */
    async componentDidMount() {
        //  call npx json-server -p 3001 -w data.json before
        const data: CardType[] = await fetch('http://localhost:3001/card').then((response) => response.json());
        const animals: Animal[] = [];
        const computer: Animal[] = [];
        const player: Animal[] = [];

        data.forEach((card) => {
            animals.push(new Animal(card.name, card.image, card.size, card.weight, card.age, card.offspring, card.speed));
        });
        this.getRandomCards(animals).forEach((animal, index) => {
            if (index % 2 === 0) {
                computer.push(animal);
            } else {
                player.push(animal);
            }
        });
        this.setState((state) =>
            update(state, {
                player: { $set: player },
                computer: { $set: computer },
            }),
        );
    }

    private restartGame() {
        // todo restart game with the shuffled cards, without fetching them again from server
        // const cards = this.getRandomCards();
        //
        // this.setState({
        //     ...this.state,
        //     playersTurn: true,
        //     player: cards.slice(0, cards.length / 2),
        //     computer: cards.slice(cards.length / 2, cards.length),
        //     selectedProperty: '',
        //     computerUncovered: false,
        // });
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
        // remove first item from player array
        let playerAnimal = update(this.state.player, { $splice: [[0, 1]] });
        const firstComputer = this.state.computer[0];
        // remove first item from computer array
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

    private getRandomCards(cards: Animal[]): Animal[] {
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
                    <React.Suspense fallback={<div>Lade Karten...</div>}>
                        <Card
                            animal={player[0]}
                            uncovered={true}
                            selectedProperty={selectedProperty}
                            onSelectProperty={this.getSelectedPropertyHandler()}
                        />
                        <Card
                            animal={computer[0]}
                            uncovered={computerUncovered}
                            selectedProperty={selectedProperty}
                        />
                    </React.Suspense>
                </div>
            </div>
        );
    }
}
