import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const NewGroup = ({ onPress }) => {
  return (
    <Pressable onPress = {onPress}>
        <View style = {styles.container}>
            <AntDesign name="addusergroup" size={20} color="white" />
            <Text style = {styles.btnText}>Create New Group</Text>
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create ({
    container: {
        flexDirection: 'row',
        padding: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#008080',
        width: '70%',
        alignSelf: 'center',
        borderRadius: 10
    },
    btnText: {
        color: 'white',
        marginLeft: 10,
        fontWeight: 'bold'
    }
})
export default NewGroup;