import React from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import styles from './styles';
import { Feather } from '@expo/vector-icons';

export default function UserItem({ user, onClick, isSelected}) {
    return (
      <Pressable onPress = {onClick} style = {styles.container}>
          <Image source = {{uri: user.imageUri}} style = {styles.image} />
          <View style={styles.rContainer}>
              <View style = {styles.row}>
                  <Text style = {styles.name}>{user.name}</Text>
              </View>
          </View>
          {isSelected !== undefined && (<Feather name={isSelected ? "check-circle" : "circle"} size={18} color="white" style = {{alignSelf: 'center'}} />)}
      </Pressable>
  );
}

