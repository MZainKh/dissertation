import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { Amplify, Hub } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import { DataStore } from '@aws-amplify/datastore';
import { Message } from './src/models';

Amplify.configure(awsconfig);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // create listener
    const listener = Hub.listen('datastore', async hubData => {
      const { event, data } = hubData.payload;
      if (event == 'outboxMutationProcessed') {
        if (data.model == Message && !(["DELIVERED", "READ"].includes(data.element.status))) {
          // setting message status to delivered
          DataStore.save(Message.copyOf(data.element, (updateStatus) => {
            updateStatus.status = "DELIVERED";
          }));
        }
      }
    });

    // remove listener
    return () => listener();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);