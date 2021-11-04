import React, { useState } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import Login from './Login';
import Chat from './Chat/Index';
import {ZodianicApp} from "./Chat/Zodianic";

function App() {
  const [config, setconfig] = useState({});
  return (
    <div className="App">
      <ZodianicApp>
        <Router>
          <Switch>
            <Route path="/chat">
              <Chat
                userId={config.userId}
                nickname={config.nickname}
                theme={config.theme}
                useCustomQuery={config.useCustomQuery}
              />
            </Route>
            <Route path="/">
              <Login onSubmit={setconfig} />
            </Route>
          </Switch>
        </Router>
      </ZodianicApp>
    </div>
  );
}

export default App;
