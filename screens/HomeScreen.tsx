import * as React from 'react';
import { Text, View, Image, StyleSheet, FlatList } from 'react-native';
import ChatItem from '../components/ChatItem';
import ChatRoomsData from '../assets/ChatRooms';

export default function TabOneScreen() {
  return (
    <View style = {styles.pageList}>
      <FlatList 
        data = {ChatRoomsData}
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