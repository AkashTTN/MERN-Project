import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import withAuth from '../hoc/withAuth'
import SignIn from '../SignIn/SignIn';
import Feed from '../Feed/Feed';
import Complaint from '../Complaint/Complaint'

import './App.css';

function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/' component={SignIn} />
          <Route path="/buzz" >
            <Feed mode="buzz" />
          </Route>
          <Route exact path="/complaints" >
            <Feed mode="complaints" />
          </Route>
          <Route path="/complaints/:id">
            <Complaint />
          </Route>
          {/* <Route path='/home' component={withAuth(Feed)} /> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
