import {Route, Redirect, Switch, BrowserRouter as Router} from 'react-router-dom';
import {useAuth} from './shared/hooks/auth-hook';
import {AuthContext} from './shared/context/auth-context';

import MainNavigation from './shared/components/Navigation/MainNavigation/MainNavigation';
import Auth from './user/pages/Auth/Auth';
import Users from './user/pages/Users/Users';
import Teams from './team/pages/Teams/Teams';
import WorkRequests from './work-request/pages/WorkRequests/WorkRequests';
import Map from './map/Map/Map';

const App = () => {

  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/auth" exact>
          <Auth/>
        </Route>
        <Route path="/users" exact>
          <Users/>
        </Route>
        <Redirect to="/auth"/>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/auth" exact>
          <Auth/>
        </Route>
        <Route path="/users" exact>
          <Users/>
        </Route>
        <Route path="/teams" exact>
          <Teams/>
        </Route>
        <Route path="/map" exact>
          <Map center={{lat: 45.267136, lng: 19.833549}} zoom={16}/>
        </Route>
        <Route path="/:userId/workrequests" exact>
          <WorkRequests/>
        </Route>
        <Redirect to="/auth"/>
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
