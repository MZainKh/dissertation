import React from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { ChatRoom, User, ChatRoomUser } from '../../src/models';
import styles from './styles';

export default function UserItem({ user }) {
    const nav = useNavigation();

    const onClick = async () => {
        // create a new chat room
        const newChat = await DataStore.save(new ChatRoom({
            newMessages: 0
        }));

        // add authenticated user to the new chat room
        const authUser = await Auth.currentAuthenticatedUser(); // getting the authenticated user
        const dbUser = await DataStore.query(User, authUser.attributes.sub); // querying the database to get the authenticated user
        console.log(dbUser);
        console.log(user);
        await DataStore.save(new ChatRoomUser({
            user: dbUser,
            chatRoom: newChat
        }));

        // add the selected user the new chat room
        await DataStore.save(new ChatRoomUser({
            user: user,
            chatRoom: newChat
        }));

        // navigate to the new chat room
        nav.navigate('Chat', { id: newChat.id });
    }

    return (
      <Pressable onPress = {onClick} style = {styles.container}>
          <Image source = {{uri: user.imageUri}} style = {styles.image} />
          <View style={styles.rContainer}>
              <View style = {styles.row}>
                  <Text style = {styles.name}>{user.name}</Text>
              </View>
          </View>
      </Pressable>
  );
}

