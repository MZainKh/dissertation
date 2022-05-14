import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { Amplify, Auth, Hub } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import { DataStore } from '@aws-amplify/datastore';
import { Message, User } from './src/models';
import moment from 'moment';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { box } from "tweetnacl";
import { generateKeyPair, encrypt, decrypt } from './utils/crypto';

Amplify.configure(awsconfig);

const obj = { hello: 'world' };
const pairA = generateKeyPair();
const pairB = generateKeyPair();
const sharedA = box.before(pairB.publicKey, pairA.secretKey);
const sharedB = box.before(pairA.publicKey, pairB.secretKey);
const encrypted = encrypt(sharedA, obj);
const decrypted = decrypt(sharedB, encrypted);
console.log(obj, encrypted, decrypted);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [currUser, setCurrUser] = useState<User|null>(null);

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


  useEffect(() => {
    if (!currUser) {
      return;
    }
    const realTimeSub = DataStore.observe(User, currUser.id).subscribe(msg => {
        if(msg.model == User && msg.opType == "UPDATE") {
            setCurrUser(msg.element);
        }
    });
    return () => realTimeSub.unsubscribe();
  }, [currUser?.id]);

  
  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      await lastSeenUpdate();
    }, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currUser]);

  const getUser = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);
    if (dbUser) {
      setCurrUser(dbUser);
    } 
  }

  const lastSeenUpdate = async () => {
    if (!currUser) {
      return;
    } 
    const updatedLastSeen = await DataStore.save(User.copyOf(currUser, (update) => {
      update.lastSeen = +new Date();
    }));
    setCurrUser(updatedLastSeen);
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ActionSheetProvider>
          <Navigation colorScheme={colorScheme} />
        </ActionSheetProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);