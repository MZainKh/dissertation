import React from 'react';
import { Text, View, Image } from 'react-native';
import { Asset } from 'expo-asset';
import styles from './styles';

export default function ChatItem({ chatRoom }) {
    const user = chatRoom.users[1];
    return (
      <View style={styles.container}>
          <Image source={{uri: user.imageUri}} style={styles.image}></Image>
          <View style={styles.rContainer}>
              <View style={styles.row}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.text}>{chatRoom.lastMessage.createdAt}</Text>
              </View>
              <Text numberOfLines={1} style={styles.text}>{chatRoom.lastMessage.content}</Text>
              {chatRoom.newMessages ? <View style={styles.unreadContainer}>
                  <Text style={styles.unreadText}>{chatRoom.newMessages}</Text>
              </View> : null}
          </View>
      </View>
  )
}

