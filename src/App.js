import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export default class App extends Component {
  render() {
    const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

    return (
      <div className="well" style={wellStyles}>
        <Button bsStyle="primary" bsSize="large" block href="/login">Login</Button>
        <Button bsSize="large" block href="/signup">Signup</Button>
      </div>
    );
  }
}
