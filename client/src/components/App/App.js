import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import withAuth from '../hoc/withAuth'
import SignIn from '../SignIn/SignIn';
import Feed from '../Feed/Feed';
import Complaint from '../Complaint/Complaint'
import About from '../About/About'
import Help from '../Help/Help'

import './App.css';

function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/' component={SignIn} />
          <Route path="/about-us" >
            <About />
          </Route>
          <Route path="/help" >
            <Help />
          </Route>
          <Route path="/buzz" >
            <Feed mode="buzz" />
          </Route>
          <Route path="/profile" >
            <Feed mode="profile" />
          </Route>
          <Route exact path="/complaints" >
            <Feed mode="complaints" />
          </Route>
          <Route path="/resolved">
            <Feed mode="resolved" />
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
