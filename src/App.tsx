import React from 'react';

import './App.scss';
import Card from './Card';

export default class App extends React.Component {
  render(): React.ReactNode {
    return (
      <div>
        <h1>Supertrumpf</h1>
        <Card />
      </div>
    );
  }
}
