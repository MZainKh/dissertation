import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, Pressable } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '../../src/models';
import { Auth, Storage } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';
import MusicPlayer from '../MusicPlayer';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../../src/models';

const ChatMessage = ( props ) => {
    const { message: propMsg } = props;
    const [user, setUser] = useState<User|undefined>();
    const [me, setMe] = useState<boolean|null>(null); 
    const [audioUri, setAudioUri] = useState<any>(null); 
    const [message, setMsg] = useState<Message>(propMsg);

    const { width } = useWindowDimensions();

    useEffect(() => {
        DataStore.query(User, message.userID).then(setUser);
    }, []);

    useEffect(() => {
        setMsg(propMsg);
    }, [propMsg]);

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

    useEffect(() => {
        if (message.audio) {
            Storage.get(message.audio).then(setAudioUri);
        }
    }, [message]);

    if(!user) {
        return <ActivityIndicator />
    }

    return (
        <View style = {[
            styles.container, me ? styles.sentContainer : styles.rcvdContainer, {width: audioUri ? '75%' : 'auto'}
        ]}>
            <View style = {styles.rowContainer}>
                { message.image && <S3Image imgKey = {message.image} style = {{width: width * 0.65, aspectRatio: 4/3, marginBottom: 10}} resizeMode = 'contain' /> }
                { audioUri && (<MusicPlayer audioUri = {audioUri} />)}
                { !!message.content && (<Text style = {{color: me ? 'black' : 'white'}}>{message.content}</Text>) }
                { me && !!message.status && message.status !== "SENT" && (<Ionicons name={message.status == "DELIVERED" ? "checkmark-outline" : "checkmark-done-outline" } size={16} color="white" style = {{marginHorizontal: 5}} />) }
            </View>
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
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    rcvdContainer: {
        backgroundColor: '#008080',
        marginLeft: 10,
        marginRight: 'auto'
    },
    sentContainer: {
        backgroundColor: "#6d6d6d",
        marginLeft: 'auto',
        marginRight: 10,
        alignItems: 'flex-end'
    }, 
    msgReply: {
        backgroundColor: '#03BFB5',
        padding: 5,
        borderRadius: 8,
    }
});

export default ChatMessage