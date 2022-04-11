import * as React from 'react';
import { Text, View, Image, StyleSheet, FlatList, Pressable } from 'react-native';
import { Auth } from 'aws-amplify';
import ChatItem from '../components/ChatItem';
import ChatRoomsData from '../assets/ChatRooms';

export default function HomeScreen() {
  const signOut = () => {
    Auth.signOut();
  }

  return (
    <View style = {styles.pageList}>
      <FlatList 
        data = {ChatRoomsData}
        renderItem = {({ item: chatItem }) => <ChatItem chatRoom = {chatItem} />}
      />
      {/* <Pressable onPress = {signOut} style = {{backgroundColor: '#008080', height: 50, margin: 10, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Sign Out</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  pageList: {
    backgroundColor: '#000000',
    flex: 1
  }
});