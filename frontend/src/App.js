import {Route, Redirect, Switch, BrowserRouter as Router} from 'react-router-dom';

import Auth from './user/pages/Auth';

function App() {

  const routes = (
    <Switch>
      <Route path="/auth" exact>
        <Auth/>
      </Route>
      <Redirect to="/auth"/>
    </Switch>
  );

  return (
    <Router>
      <main>
        {routes}
      </main>
    </Router>
  );
}

export default App;
