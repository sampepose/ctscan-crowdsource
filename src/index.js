import React from 'react';
import ReactDOM from 'react-dom';
import {IndexRoute, Router, Route, browserHistory} from 'react-router'

// Views
import App from './App';
import Dash from './Dash';
import Login from './Login';
import Signup from './Signup';

// dat CSS
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'react-image-crop/dist/ReactCrop.css';

function requireAuth(nextState, replace) {
  if (nextState && nextState.location && nextState.location.pathname !== '/dash') {
    return;
  }
  if (!localStorage.getItem('loggedIn')) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    });
  } else {
    if (nextState && nextState.location && nextState.location.pathname !== '/dash') {
      replace({
        pathname: '/dash',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" onEnter={requireAuth} >
      <IndexRoute component={App}/>
      <Route path="login" component={Login}/>
      <Route path="signup" component={Signup}/>
      <Route path="dash" component={Dash}/>
    </Route>
  </Router>
), document.getElementById('root'))
