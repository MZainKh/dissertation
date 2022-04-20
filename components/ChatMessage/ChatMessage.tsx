import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '../../src/models';
import { Auth } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';

const ChatMessage = ({ message }) => {
    const [user, setUser] = useState<User|undefined>();
    const [me, setMe] = useState<boolean>(false); 

    const { width } = useWindowDimensions();

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
            { message.image && <S3Image imgKey = {message.image} style = {{width: width * 0.7, aspectRatio: 4/3, marginBottom: 10}} resizeMode = 'contain' /> }
            { !!message.content && (<Text style = {{color: me ? 'black' : 'white'}}>{message.content}</Text>) }
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        padding: 8,
        margin: 10,
        borderRadius: 15,
        maxWidth: '75%',
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