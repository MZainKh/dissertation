import * as React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import ChatItem from '../components/ChatItem';
import ChatRoomsData from '../assets/ChatRooms';

const chatRoom1 = ChatRoomsData[0];
const chatRoom2 = ChatRoomsData[1];
 
export default function TabOneScreen() {
  return (
    <View style={styles.pageList}>
      <ChatItem chatRoom={chatRoom1} />
      <ChatItem chatRoom={chatRoom2} />
    </View>
  );
}

const styles = StyleSheet.create({
  pageList: {
    backgroundColor: '#000000',
    flex: 1
  }
});