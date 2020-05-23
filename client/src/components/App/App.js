import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import SignIn from '../SignIn/SignIn'
import Feed from '../Feed/Feed';

import './App.css';

function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/'>
            <SignIn />
          </Route>
          <Route path='/feed'>
            <Feed />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
