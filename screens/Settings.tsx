import React from 'react'
import { View, Text, Pressable, Alert } from 'react-native';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { generateKeyPair } from '../utils/crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../src/models';

export const PVT_KEY = "PVT_KEY";

const Settings = () => {
    // sign out function
    const signOut = async () => {
        await DataStore.clear();
        Auth.signOut();
    }

const keypairUpdate = async () => {
    // generate pvt / public key
    const {publicKey, secretKey} = generateKeyPair();
    // save pvt key
    await AsyncStorage.setItem(PVT_KEY, secretKey.toString());
    // save pub key 
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);

    if (!dbUser) {
        Alert.alert("No such user found!");
        return;
    }

    await DataStore.save(User.copyOf(dbUser, (userUpdate) => {
        userUpdate.publicKey = publicKey.toString();
    }));

    Alert.alert("Successfully updated the key pair!!");
}
  return (
    <View>
      <Text>Settings</Text>

      <Pressable onPress = {keypairUpdate} style = {{backgroundColor: '#008080', height: 50, margin: 10, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Key Pair Update</Text>
      </Pressable>

      <Pressable onPress = {signOut} style = {{backgroundColor: '#008080', height: 50, margin: 10, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  )
}

export default Settings;