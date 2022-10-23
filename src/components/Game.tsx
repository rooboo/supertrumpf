import * as React from 'react';
import update from 'immutability-helper';
import Animal from './Animal';
import Card from './Card';

import './Game.scss';

interface GameProps {
    title: string;
}

interface GameState {
    playersTurn: boolean,
    player: Animal[],
    computer: Animal[],
    selectedProperty: string,
    computerUncovered: boolean
}

export default class Game extends React.Component<GameProps, GameState> {

    static defaultProps = {
        title: 'Supertrumpf'
    }
    state = {
        playersTurn: true,
        player: [new Animal('Elefant', 'elefant.png', 3.3, 6000, 70, 1, 40),
            new Animal('Flusspferd', 'flusspferd.png', 1.5, 1800, 50, 1, 30)],
        computer: [new Animal('Nashorn', 'nashorn.png', 1.9, 2300, 50, 1, 50),
            new Animal('Krokodil', 'krokodil.png', 5.2, 1000, 70, 60, 29)],
        selectedProperty: '',
        computerUncovered: false
    }

    play(property: string) {
        this.setState(state => update(state, {
                selectedProperty: {$set: property},
                computerUncovered: {$set: true}
            }),
            () => {
                setTimeout(() => {
                    this.compare(property);
                }, 2000);
            });
    }

    getSelectedPropertyHandler() {
        return (property: string) => this.play(property);
    }

    compare(property: string) {
        let playersTurn = this.state.playersTurn;
        const firstPlayer = this.state.player[0];
        let player = update(this.state.player, {$splice: [[0, 1]]}); // remove on item from array starting from position one
        const firstComputer = this.state.computer[0];
        let computer = update(this.state.computer, {$splice: [[0, 1]]});// remove on item from array starting from position one
        const playerProp = Object.entries(firstPlayer).find(prop => prop[0] === property);
        const computerProp = Object.entries(firstComputer).find(prop => prop[0] === property);
        if (Array.isArray(playerProp) && Array.isArray(computerProp)) {
            const playerPropValue = playerProp[1];
            const computerPropValue = computerProp[1];
            if (playerPropValue > computerPropValue) {
                playersTurn = true;
                player = update(player, {$push: [firstPlayer, firstComputer]}); // add computer card to player cards
                if (computer.length === 0) {
                    alert('Player wins!');
                    return;
                }
            } else if (playerPropValue < computerPropValue) {
                playersTurn = false;
                computer = update(computer, {$push: [firstPlayer, firstComputer]}); // add player card to computer cards
                if (player.length === 0) {
                    alert('Computer wins!');
                    return;
                }
            } else {
                // add the card of each player back to their deck
                player = update(player, {$push: [firstPlayer]});
                computer = update(computer, {$push: [firstComputer]});
            }
        }
        this.setState(
            state => update(state, {
                $set: {
                    computerUncovered: false,
                    selectedProperty: '',
                    playersTurn,
                    player,
                    computer

                }
            }), () => {
                if (!playersTurn) {
                    setTimeout(() => {
                        const property = this.selectRandomProperty();
                        this.play(property);
                    }, 2000);
                }
            }
        )
    }

    private selectRandomProperty(): string {
        const properties = Object.keys(Animal.properties);
        const index = Math.floor(Math.random() * properties.length);
        return properties[index];
    }

    render() {
        const {player, computer, playersTurn, selectedProperty, computerUncovered} = this.state;
        return (
            <div>
                <h1>{this.props.title}</h1>
                <div className='info'>
                    {playersTurn ? 'Du bist' : 'Der Computer ist'} an der Reihe
                </div>
                <div className='cards'>
                    <Card animal={player[0]} uncovered={true} selectedProperty={selectedProperty}
                          onSelectProperty={this.getSelectedPropertyHandler().bind(this)}/>
                    <Card animal={computer[0]} uncovered={computerUncovered} selectedProperty={selectedProperty}/>
                </div>
            </div>
        );
    }

}
