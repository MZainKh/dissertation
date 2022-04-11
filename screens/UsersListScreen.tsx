import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import userData from '../assets/Users';
import UserItem from '../components/UserItem';

export default function UsersListScreen() {

  return (
    <View style = {styles.pageList}>
      <FlatList 
        data = {userData}
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