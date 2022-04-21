import React from 'react'
import { View, Text, Pressable } from 'react-native';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { generateKeyPair } from '../utils/crypto';

const Settings = () => {
    const signOut = async () => {
        await DataStore.clear();
        Auth.signOut();
    }

const keypairUpdate = async () => {
    // generate pvt / public key
    const {publicKey, secretKey} = generateKeyPair();
    // save pvt key

    // save pub key 
}
  return (
    <View>
      <Text>Settings</Text>

      <Pressable onPress = {keypairUpdate} style = {{backgroundColor: '#008080', height: 50, margin: 10, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Update Key Pair</Text>
      </Pressable>

      <Pressable onPress = {signOut} style = {{backgroundColor: '#008080', height: 50, margin: 10, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  )
}

export default Settings;