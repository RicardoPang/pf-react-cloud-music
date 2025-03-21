import React from 'react';
import { Provider } from 'react-redux';
import { GlobalStyle } from './style';
import { renderRoutes } from 'react-router-config';
import { IconStyle } from './assets/iconfont/iconfont';
import store from './store/index';
import routes from './routes/index';
import { HashRouter } from 'react-router-dom';
import { Data } from './application/Singers/data';
import { ThemeProvider } from 'styled-components';
import theme from './assets/theme';

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <IconStyle />
          <Data>{renderRoutes(routes)}</Data>
        </ThemeProvider>
      </HashRouter>
    </Provider>
  );
}

export default App;
