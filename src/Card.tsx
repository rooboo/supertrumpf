import * as React from 'react';

import './Card.scss';
import Animal from './Animal';

export default function Card(): JSX.Element {
  const elephant: Animal = new Animal('Elefant', 'elefant.png', 3.3, 6000, 70, 1, 40);
  return (
    <div className='card'>
      <h1>{elephant.name}</h1>
      <img alt={elephant.name} height='200' width='200' src={`${process.env.PUBLIC_URL}/${elephant.image}`} />
      <table>
        <tbody>
          {Object.entries(elephant).map(([k, v]) => {
            return <tr key={k}>{v}</tr>;
          })}
          <tr>
            <td>Größe</td>
            <td>3.3 m</td>
          </tr>
          <tr>
            <td>Gewicht</td>
            <td>6000 kg</td>
          </tr>
          <tr>
            <td>Alter</td>
            <td>70 Jahre</td>
          </tr>
          <tr>
            <td>Nachkommen</td>
            <td>1</td>
          </tr>
          <tr>
            <td>Geschwindigkeit</td>
            <td>40 km/h</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
