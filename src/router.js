import React from 'react';
import { Router, Route, Switch, Redirect, } from 'dva/router';
import dynamic from 'dva/dynamic';
import Error from './routes/error/index.jsx';
function RouterConfig({ history, app }) {
  
  const routes = [
    // {
    //   path: '/error',
    //   component: () => import('./routes/error/index.jsx'),
    // },
    {
      path: '/app',
      component: () => import('./routes/home/home.jsx'),
    },
  ]

  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/app"/>} />
        {
          routes.map(({path, ...dynamics}, key) => (
            <Route
              key={key}
              exact
              path={path}
              component={
                dynamic({
                  app,
                  ...dynamics,
                })
              }
            />
          ))
        }
        <Route component={Error} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
