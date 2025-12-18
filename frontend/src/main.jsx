import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { store } from './store';
import './index.css';
import './i18n';
import App from './App.jsx';

const rollbarConfig = {
  accessToken: '54f6d3559c64495ca22c3ad9a9eb971eff1a8b6a4b263f57b7868ca76a400172e441e0c8ea63a8bf64dcedd27a00d971',
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  </StrictMode>,
);
