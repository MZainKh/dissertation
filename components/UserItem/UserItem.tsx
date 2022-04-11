import React from 'react';
import { Text, View, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import styles from './styles';

export default function UserItem({ user }) {
    const nav = useNavigation();

    const onClick = () => {
        // create chat room with selected user

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

