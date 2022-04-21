import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, FlatList, Pressable } from 'react-native';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { ChatRoom, ChatRoomUser } from '../src/models';
import ChatItem from '../components/ChatItem';

export default function HomeScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const getChatRooms = async () => {
      const currAuthUser = await Auth.currentAuthenticatedUser();
      const chatRooms = (await DataStore.query(ChatRoomUser)).filter(ChatRoomUser => ChatRoomUser.user.id == currAuthUser.attributes.sub).map(ChatRoomUser => ChatRoomUser.chatRoom);
      setChatRooms(chatRooms);
    };
    getChatRooms();
  }, []);

  const signOut = async () => {
    await DataStore.clear();
    Auth.signOut();
  }

  return (
    <View style = {styles.pageList}>
      <FlatList 
        data = {chatRooms}
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