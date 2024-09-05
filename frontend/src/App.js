import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Chat from './components/Chat';
import GroupChat from './components/GroupChat';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/chat" component={Chat} />
          <Route path="/group-chat" component={GroupChat} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
