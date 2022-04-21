import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
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

  return (
    <View style = {styles.pageList}>
      <FlatList 
        data = {chatRooms}
        renderItem = {({ item: chatItem }) => <ChatItem chatRoom = {chatItem} />}
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