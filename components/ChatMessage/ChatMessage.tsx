import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '../../src/models';
import { Auth } from 'aws-amplify';

const myID = 'u1';

const ChatMessage = ({ message }) => {
    const [user, setUser] = useState<User|undefined>();
    const [me, setMe] = useState<boolean>(false); 

    useEffect(() => {
        DataStore.query(User, message.userID).then(setUser);
    }, []);

    useEffect(() => {
        const ifMe = async () => {
            if(!user) {
                return;
            }
            const currAuthUser = await Auth.currentAuthenticatedUser();
            setMe(user.id == currAuthUser.attributes.sub);
        };
        ifMe();
    }, [user]);

    if(!user) {
        return <ActivityIndicator />
    }

    return (
        <View style = {[
            styles.container, me ? styles.sentContainer : styles.rcvdContainer
        ]}>
        <Text style = {{color: me ? 'black' : 'white'}}>{message.content}</Text>
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