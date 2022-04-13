import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { Users } from '../src/models';
import UserItem from '../components/UserItem';

export default function UsersListScreen() {
  const [users, setUsers] = useState<Users[]>([]);

  // useEffect(() => {
  //   DataStore.query(Users).then(setUsers);
  // }, []);

  useEffect(() => {
    // query the list of users
    const getUsers = async () => {
      const gotUsers = await DataStore.query(Users);
      setUsers(gotUsers);
    };
    getUsers();
  }, []);

  return (
    <View style = {styles.pageList}>
      <FlatList 
        data = {users}
        renderItem = {({ item }) => <UserItem user = {item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pageList: {
    backgroundColor: '#000000',
    flex: 1
  }
});