import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, Pressable, Alert } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '../../src/models';
import { Auth, Storage } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';
import MusicPlayer from '../MusicPlayer';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../../src/models';
import { useActionSheet } from '@expo/react-native-action-sheet';
import ChatMessageRepliedTo from '../ChatMessageRepliedTo';
import { box } from 'tweetnacl';
import { decrypt, mySecretKey, strToUint8Array } from '../../utils/crypto';

const ChatMessage = ( props ) => {
    const { setMsgReply, message: propMsg } = props;
    const [user, setUser] = useState<User|undefined>();
    const [me, setMe] = useState<boolean|null>(null); 
    const [audioUri, setAudioUri] = useState<any>(null); 
    const [message, setMsg] = useState<Message>(propMsg);
    const [decMsg, setDecMsg] = useState('');
    const [msgRepliedTo, setMsgRepliedTo] = useState<Message|undefined>();
    const [deleted, setDeleted] = useState(false);

    const { width } = useWindowDimensions();
    const { showActionSheetWithOptions } = useActionSheet();

    useEffect(() => {
        DataStore.query(User, message.userID).then(setUser);
    }, []);

    useEffect(() => {
        setMsg(propMsg);
    }, [propMsg]);

    useEffect(() => {
        if (message?.replyToMessageID) {
            DataStore.query(Message, message.replyToMessageID).then(setMsgRepliedTo);
        }
    }, [message]);


    useEffect(() => {
        const realTimeSub = DataStore.observe(Message, message.id).subscribe(msg => {
            if(msg.model == Message && msg.opType == "UPDATE") {
                setMsg((message) => ({...message, ...msg.element}));
            } else if (msg.opType == "DELETE") {
                setDeleted(true);
            }
        });
        return () => realTimeSub.unsubscribe();
    }, []);

    const setMsgRead = async () => {
        if (me == false && message.status !== "READ") {
            await DataStore.save(Message.copyOf(message, (updateStatus) => {
                updateStatus.status = "READ";
            }));
        }
    }

    useEffect(() => {
        setMsgRead();
    }, [me, message]);

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

    // decrypting the message
    useEffect(() => {
        if(!message?.content || !user?.publicKey) {
            return;
        }
        const decMessage = async () => {
            const userPubKey = strToUint8Array(user?.publicKey);
            const mySecKey = await mySecretKey();
            if (!mySecKey) {
                return;
            }
            const shared = box.before(userPubKey, mySecKey);
            const dec = decrypt(shared, message.content);
            setDecMsg(dec.message)
        }
        decMessage();
    }, [message, user]);

    const deleteMsg = async () => {
        await DataStore.delete(message);
    }

    const confMsgDelete = () => {
        Alert.alert("Confirming Destruct", "You sure you wanna delete this?", [
            {
                text: "Destroy it",
                onPress: deleteMsg,
                style: 'destructive'
            },
            {
                text: "Cancel"
            }
        ]);
    }

    const actionTriggered = (index) => {
        if (index == 0) {
            setMsgReply();
        } else if (index == 1) {
            if (me) {
                confMsgDelete();
            } else {
                Alert.alert("Cannot do this", "Not your message");
            }
        }
    }

    const actionMenu = () => {
        const options =  ["Reply", "Delete", "Cancel"];
        const destructiveButtonIndex = 1;
        const cancelButtonIndex = 2;
        showActionSheetWithOptions({options, destructiveButtonIndex, cancelButtonIndex}, actionTriggered);
    }

    if(!user) {
        return <ActivityIndicator />
    }

    return (
        <Pressable onLongPress = {actionMenu} style = {[
            styles.container, me ? styles.sentContainer : styles.rcvdContainer, {width: audioUri ? '75%' : 'auto'}
        ]}>
            { msgRepliedTo && (<ChatMessageRepliedTo message = {msgRepliedTo} />) }
            <View style = {styles.rowContainer}>
                { message.image && <S3Image imgKey = {message.image} style = {{width: width * 0.65, aspectRatio: 4/3, marginBottom: 10}} resizeMode = 'contain' /> }
                { audioUri && (<MusicPlayer audioUri = {audioUri} />)}
                { !!decMsg && (<Text style = {{color: me ? 'black' : 'white'}}>{deleted ? "deleted message" : decMsg}</Text>) }
                { me && !!message.status && message.status !== "SENT" && (<Ionicons name={message.status == "DELIVERED" ? "checkmark-outline" : "checkmark-done-outline" } size={16} color="white" style = {{marginHorizontal: 5}} />) }
            </View>
        </Pressable>
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