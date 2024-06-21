import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Auth from '/components/Auth';
import Navbar from '/components/Navbar';
import PlayerDetail from '/components/PlayerDetail';
import PlayerList from '/components/PlayerList';
import Portfolio from '/components/Portfolio';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="App">
                <Switch>
                    <Route path="/" exact component={PlayerList} />
                    <Route path="/player/:id" component={PlayerDetail} />
                    <Route path="/auth" component={Auth} />
                    <Route path="/portfolio" component={Portfolio} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
