import React, { useState, useEffect } from 'react';
import { Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { DataStore } from '@aws-amplify/datastore';
import { ChatRoomUser, User } from '../../src/models';
import styles from './styles';
import { Auth } from 'aws-amplify';

export default function ChatItem({ chatRoom }) {
    const [users, setUsers] = useState<User[]>([]); // all the users in the chatRoom
    const [user, setUser] = useState<User|null>(null); // displayed user

    const navigation = useNavigation();

    useEffect(() => {
        const getUsers = async () => {
            const gotUsers = (await DataStore.query(ChatRoomUser)).filter(ChatRoomUser => ChatRoomUser.chatRoom.id == chatRoom.id).map(ChatRoomUser => ChatRoomUser.user);
            setUsers(gotUsers);
            const currAuthUser = await Auth.currentAuthenticatedUser();
            setUser(gotUsers.find(user => user.id !== currAuthUser.attributes.sub) || null);
        };
        getUsers();
    }, []);

    const onClick = () => {
        navigation.navigate('Chat', { id: chatRoom.id });
    }

    if(!user) {
        return <ActivityIndicator />
    }

    return (
      <Pressable onPress = {onClick} style = {styles.container}>
          <Image source = {{uri: user.imageUri}} style = {styles.image}></Image>
          <View style={styles.rContainer}>
              <View style = {styles.row}>
                  <Text style = {styles.name}>{user.name}</Text>
                  <Text style = {styles.text}>{chatRoom.lastMessage?.createdAt}</Text>
              </View>
              <Text numberOfLines = {1} style = {styles.text}>{chatRoom.lastMessage?.content}</Text>
              {!!chatRoom.newMessages ? <View style = {styles.unreadContainer}>
                  <Text style = {styles.unreadText}>{chatRoom.newMessages}</Text>
              </View> : null}
          </View>
      </Pressable>
  )
}

