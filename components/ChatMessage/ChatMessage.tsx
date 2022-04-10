import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const myID = 'u1';

const ChatMessage = ({ message }) => {
    const isMyMsg = message.user.id == myID;

    return (
        <View style = {[
            styles.container, isMyMsg ? styles.sentContainer : styles.rcvdContainer
        ]}>
        <Text style = {{color: isMyMsg ? 'black' : 'white'}}>{message.content}</Text>
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        padding: 8,
        margin: 10,
        borderRadius: 15,
        maxWidth: '65%',
    },
    rcvdContainer: {
        backgroundColor: '#008080',
        marginLeft: 10,
        marginRight: 'auto'
    },
    sentContainer: {
        backgroundColor: "#6d6d6d",
        marginLeft: 'auto',
        marginRight: 10
    }
});

export default ChatMessage