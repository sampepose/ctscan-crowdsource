import {browserHistory} from 'react-router'
import React, {Component} from 'react';
import 'es6-promise';
import 'whatwg-fetch';

export default class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      usernameErrorMessage: null,
      passwordErrorMessage: null,
      errorMessage: null,
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e) {
    if (e.target.value.length <= 0) {
      this.setState({
        usernameErrorMessage: 'Please enter a valid username.',
      });
    } else {
      this.setState({
        username: e.target.value,
        usernameErrorMessage: null,
      });
    }
  }

  handlePasswordChange(e) {
    if (e.target.value.length <= 0) {
      this.setState({
        passwordErrorMessage: 'Please enter a valid password.',
      });
    } else {
      this.setState({
        password: e.target.value,
        passwordErrorMessage: null,
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch('/api/signup', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state),
    })
    .then(data => {
      if (data.status !== 201) {
        this.setState({
          errorMessage: 'Could not signup successfully. Please try again.',
          usernameErrorMessage: null,
          passwordErrorMessage: null,
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
        usernameErrorMessage: null,
        passwordErrorMessage: null,
      });
      localStorage.setItem('loggedIn', null);
      console.error(err);
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            required="required"
            value={this.state.username}
            onChange={this.handleUsernameChange} />
        </p>
        {this.state.usernameErrorMessage && <p>{this.state.usernameErrorMessage}</p>}
        <p>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required="required"
            value={this.state.password}
            onChange={this.handlePasswordChange} />
        </p>
        {this.state.passwordErrorMessage && <p>{this.state.passwordErrorMessage}</p>}
        {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
        <input type="submit" value="Signup" />
      </form>
    );
  }
}
