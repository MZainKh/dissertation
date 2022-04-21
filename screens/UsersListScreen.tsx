import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import UserItem from '../components/UserItem';
import NewGroup from '../components/NewGroup';
import { useNavigation } from '@react-navigation/core';
import { Auth } from 'aws-amplify';
import { ChatRoom, User, ChatRoomUser } from '../src/models';

export default function UsersListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [usersSelected, setUsersSelected] = useState<User[]>([]);

  const nav = useNavigation();

  useEffect(() => {
    // query the list of users
    const getUsers = async () => {
      const gotUsers = await DataStore.query(User);
      setUsers(gotUsers);
    };
    getUsers();
  }, []);

  const addToChatRoom = async (user, chatRoom) => {
    DataStore.save(new ChatRoomUser ({
      user: user,
      chatRoom: chatRoom
    }));
  };

  const newChatRoom = async (users) => {
    const authUser = await Auth.currentAuthenticatedUser(); // getting the authenticated user
    const dbUser = await DataStore.query(User, authUser.attributes.sub); // querying the database to get the authenticated user

    // create a new chat room
    const newChat = await DataStore.save(new ChatRoom({
        newMessages: 0,
        Admin: dbUser,

    }));
    if (users.length > 1) {
      newChat.name = "New Group";
      newChat.imageUri = "https://www.clipartmax.com/png/middle/204-2045091_group-together-teamwork-icon-people-icon-flat-png.png";
    }
    // add authenticated user to the new chat room
    if (dbUser) {
      await addToChatRoom(dbUser, newChat);  
    }

    // add the selected users to the new chat room
    await Promise.all(users.map((user) => addToChatRoom(user, newChat)));

    // navigate to the new chat room
    nav.navigate('Chat', { id: newChat.id });
  };

  const selectedUser = (user) => {
    return usersSelected.some((userSelected) => userSelected.id == user.id);
  }

  const onUserClick = async (user) => {
    if (isGroup) {
      if (selectedUser(user)) {
        // remove from selection
        setUsersSelected(usersSelected.filter(userSelected => userSelected.id !== user.id))
      } else {
        setUsersSelected([...usersSelected, user]);
      }
    } else {
      await newChatRoom([user]);
    }
  }

  const createGroup = async () => {
    await newChatRoom(usersSelected);
  }

  return (
    <SafeAreaView style = {styles.pageList}>
      <FlatList 
        data = {users}
        renderItem = {({ item }) => (<UserItem user = {item} onClick = {() => onUserClick(item)} isSelected = {isGroup ? selectedUser(item) : undefined} />)}
        ListHeaderComponent = {() => (<NewGroup onPress = {() => setIsGroup(!isGroup)} />)}
      />
      {isGroup && <Pressable onPress = {createGroup} style = {styles.btn}>
        <Text style = {styles.btnText}>Create Group ({usersSelected.length})</Text>
      </Pressable>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageList: {
    backgroundColor: '#000000',
    flex: 1
  },
  btn: {
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008080',
    width: '30%',
    alignSelf: 'center',
    borderRadius: 10
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold'
  }
});