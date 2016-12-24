'use strict';

import {browserHistory} from 'react-router'
import React, {Component} from 'react';
import 'es6-promise';
import 'whatwg-fetch';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state),
    })
    .then(data => {
      if (data.status !== 201) {
        this.setState({
          errorMessage: 'Could not authorize login. Please try again.',
        });
        localStorage.setItem('loggedIn', null);
      } else {
        localStorage.setItem('loggedIn', true);
        browserHistory.push('/dash');
      }
    })
    .catch(err => {
      this.setState({
        errorMessage: 'Could not authorize login. Please try again.',
      });
      localStorage.setItem('loggedIn', null);
      console.error(err);
    });
  }

  render() {
    let errorMessage = null;
    if (this.state.errorMessage) {
      errorMessage = <p>{this.state.errorMessage}</p>
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <p>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            required="required"
            value={this.state.username}
            onChange={(e) => this.handleChange(e, 'username')} />
        </p>
        <p>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required="required"
            value={this.state.password}
            onChange={(e) => this.handleChange(e, 'password')} />
        </p>
        {errorMessage}
        <input type="submit" />
      </form>
    );
  }
}
