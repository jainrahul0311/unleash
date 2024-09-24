1\. Install the SDK
```sh
npm install @unleash/proxy-client-react unleash-proxy-client
```

2\. Initialize Unleash
```jsx
import { createRoot } from 'react-dom/client';
import { FlagProvider } from '@unleash/proxy-client-react';

const config = {
  url: '<YOUR_API_URL>',
  clientKey: '<YOUR_API_TOKEN>',
  refreshInterval: 5, // In production use interval of >15s
  appName: 'unleash-onboarding-react',
};

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <FlagProvider config={config}>
      <App />
    </FlagProvider>
  </React.StrictMode>
);
```

3\. Check feature flag status
```jsx
import { useFlag } from '@unleash/proxy-client-react';

const TestComponent = () => {
  const enabled = useFlag('<YOUR_FLAG>');

  return enabled ? 'Flag is enabled' : 'Flag is disabled'
};
```