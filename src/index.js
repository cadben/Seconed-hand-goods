import dva from 'dva';
import { createBrowserHistory } from 'history';
import './index.css';
import auth from './models/auth';

// 1. Initialize
const app = dva({
  history: createBrowserHistory(),
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);
app.model(auth);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
