import {Route, Redirect, Switch, BrowserRouter as Router} from 'react-router-dom';
import {useAuth} from './shared/hooks/auth-hook';
import {AuthContext} from './shared/context/auth-context';

import Auth from './user/pages/Auth/Auth';
import Profile from './user/pages/Profile/Profile';
import MainNavigation from './shared/components/Navigation/MainNavigation/MainNavigation';

const App = () => {

  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/auth" exact>
          <Auth/>
        </Route>
        <Redirect to="/auth"/>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/:userId/profile" exact> {/*ovo ovde ne ide*/}
          <Profile/>
        </Route>
        <Route path="/auth" exact>
          <Auth/>
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
