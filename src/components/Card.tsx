import * as React from 'react';

import './Card.scss';
import Animal from './Animal';

interface CardProps {
    animal: Animal,
    uncovered: boolean,
    selectedProperty: string,
    onSelectProperty?: (prop: string) => void,
}

export default function Card({animal, uncovered, selectedProperty, onSelectProperty}: CardProps): JSX.Element {

    const back = (<div className='card back'/>);
    let front: JSX.Element;
    if (animal) {
        front =
            (
                <div className='card'>
                    <h1>{animal.name ? animal.name : 'Unbekannt'}</h1>
                    {animal.image &&
                        <img alt={animal.name} height='200' width='200'
                             src={`${process.env.PUBLIC_URL}/${animal.image}`}/>}
                    <table>
                        <tbody>
                        {Object.entries(Animal.properties).map(property => {
                            const propKey = property[0];
                            const val = Object.entries(animal).find(prop => prop[0] === propKey);
                            if (Array.isArray(val) && val.length > 1) {
                                return (<tr key={propKey}
                                            className={selectedProperty === propKey ? 'active' : ''}
                                            onClick={() => onSelectProperty?.(propKey)}>
                                    <td>{property[1].label}</td>
                                    <td>{val[1]}&nbsp;{property[1].unit}</td>
                                </tr>);
                            }
                        })}
                        </tbody>
                    </table>
                </div>
            );
    } else {
        front = (<div></div>);
    }
    if (uncovered) {
        return front;
    } else {
        return back;
    }
}
