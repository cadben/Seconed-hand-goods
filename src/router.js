import React from 'react';
import { Route, Switch, Redirect, routerRedux } from 'dva/router';
import dynamic from 'dva/dynamic';
import App from './routes/app';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error')
  });
  const routes = [
    {
      path: '/error',
      component: () => import('./routes/error/index.jsx'),
    },
    {
      path: '/app',
      component: () => import('./routes/home/home.jsx'),
    },
    {
      path: '/app/login',
      component: () => import('./routes/Login'),
    },
    {
      path: '/app/goodscenter',
      component: () => import('./routes/GoodsCenter'),
    },
    {
      path: '/app/publish',
      component: () => import('./routes/Publish'),
    }
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route path="/" exact render={() => <Redirect to="/app"/>} />
          {
            routes.map(({path, ...dynamics}, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  );
}

export default RouterConfig;
