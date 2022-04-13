import React from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { ChatRooms, Users, ChatRoomsUsers } from '../../src/models';
import styles from './styles';

export default function UserItem({ user }) {
    const nav = useNavigation();

    const onClick = async () => {
        // create a chat room with selected user
        const newChat = await DataStore.save(new ChatRooms({newMessages: 0}));

        // add authenticated user to the created chat room
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const dbUser = await DataStore.query(Users, authenticatedUser.attributes.sub);
        await DataStore.save(new ChatRoomsUsers({
            user: dbUser,   
            chatroom: newChat
        }));

        // add selected user to the created chat room
        await DataStore.save(new ChatRoomsUsers({
            user,
            chatroom: newChat
        }));

        nav.navigate('Chat', { id: newChat.id });

    }

    return (
      <Pressable onPress = {onClick} style = {styles.container}>
          <Image source = {{uri: user.imageUri}} style = {styles.image}></Image>
          <View style={styles.rContainer}>
              <View style = {styles.row}>
                  <Text style = {styles.name}>{user.name}</Text>
              </View>
          </View>
      </Pressable>
  )
}

