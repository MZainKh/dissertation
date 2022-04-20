import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Image } from 'react-native';
import styles from './styles';
import { DataStore } from '@aws-amplify/datastore';
import { Auth, Storage } from 'aws-amplify';
import { Message } from '../../src/models';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { ChatRoom } from '../../src/models';
import EmojiSelector from 'react-native-emoji-selector';
import * as ImagePicker from 'expo-image-picker';
import { Audio, AVPlaybackStatus } from 'expo-av';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import MusicPlayer from '../MusicPlayer';

const ChatMessageInput = ({ chatRoom }) => {
    const [message, setMessage] = useState('');
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [img, setImg] = useState<string|null>(null);
    const [prog, setProg] = useState(0);
    const [record, setRecord] = useState<Audio.Recording|null>(null);
    const [audioUri, setAudioUri] = useState<string|null>(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const libResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();
                const imgResponse = await ImagePicker.requestCameraPermissionsAsync();
                const audioResponse = await Audio.requestPermissionsAsync();
                if (libResponse.status !== "granted" || imgResponse.status !== "granted") {
                    alert("Give permission idiot!");
                }
            }
        })();
    }, []);

    // reset the fields
    const reset = () => {
        setMessage('');
        setEmojiOpen(false);
        setImg(null);
        setProg(0);
        setAudioUri(null);
    }

    const sendMessage = async () => {
        const currUser = await Auth.currentAuthenticatedUser(); 
        const newMessage = await DataStore.save(new Message({
            content: message,
            userID: currUser.attributes.sub,
            chatroomID: chatRoom.id,
        }));
        lastMessageUpdate(newMessage);
        reset();
    };

    const lastMessageUpdate = async (newMessage) => {
        DataStore.save(ChatRoom.copyOf(chatRoom, chatRoomUpdated => {
            chatRoomUpdated.LastMessage = newMessage;
        }));
    };

    const onPlusClicked = () => {
        console.warn("Plus Clicked");
    };

    const onClick = () => {
        if (img) {
            sendImg();
        } else if (audioUri) {
            sendAudio();
        } else if (message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
    };

    // Pick an image
    const pickImg = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1
        });

        console.log(result);

        if (!result.cancelled) {
            setImg(result.uri);
        }
    };

    // Take a photo
    const photo = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4,3],
            quality: 1
        });

        if (!result.cancelled) {
            setImg(result.uri);
        }
    };

    // progress of image upload 
    const progressCallback = (progress) => {
        // console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        setProg(progress.loaded/progress.total);
    }

    // Send the captured/selected image
    const sendImg = async () => {
        if (!img) {
            return;
        }

        const imgBlob = await blob(img);
        const { key } = await Storage.put(`${uuidv4()}.png`, imgBlob, {progressCallback});

        const currUser = await Auth.currentAuthenticatedUser(); 
        const newMessage = await DataStore.save(new Message({
            content: message,
            image: key, 
            userID: currUser.attributes.sub,
            chatroomID: chatRoom.id,
        }));
        lastMessageUpdate(newMessage);
        reset();
    };

    const blob = async (uri: string) => {
        const responseImg = await fetch(uri);
        const imgBlob  = await responseImg.blob();
        return imgBlob;
    }

    // sending the audio
    const sendAudio = async () => {
        if (!audioUri) {
            return;
        }

        const audioUriSplit = audioUri.split('.');
        const fileExt = audioUriSplit[audioUriSplit.length - 1];
        const audioBlob = await blob(audioUri);
        const { key } = await Storage.put(`${uuidv4()}.${fileExt}`, audioBlob, {});

        const currUser = await Auth.currentAuthenticatedUser(); 
        const newMessage = await DataStore.save(new Message({
            content: message,
            audio: key, 
            userID: currUser.attributes.sub,
            chatroomID: chatRoom.id,
        }));
        lastMessageUpdate(newMessage);
        reset();
    };

    // Start and Stop Recording Audio
    async function recordingStart() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true
            });
            console.log('Recording has now begun');
            const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            setRecord(recording);
            console.log('Recording is now complete');
        } catch (e) {
            console.error('Failed to start recording your voice', e);
        }
    }

    async function recordingStop() {
        console.log('Recording is now being stopped');
        if (!record) {
            return;
        }
        setRecord(null);
        await record.stopAndUnloadAsync();
        
        // for hearing the recording from speaker in IOS
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false
        });

        const audioUri = record.getURI();
        console.log('Recording has now been completed and stored at', audioUri); 
        if (!audioUri) {
            return;
        }
        setAudioUri(audioUri);
    }

    return (
        <KeyboardAvoidingView 
            behavior = {Platform.OS == "ios" ? "padding" : "height"} 
            keyboardVerticalOffset = {100}
            style = {[styles.root, {height: emojiOpen ? '50%' : 'auto'}]}
        >
            {img && (
                <View style = {styles.selectedImgContainer}>
                    <Image source = {{uri: img}} style = {styles.img} />
                    <View style = {{flex: 1, justifyContent: 'flex-start', alignSelf: 'flex-end'}}>
                        <View style = {{height: 5, backgroundColor: '#008080', borderRadius: 5, width: `${prog * 100}%`}} />
                    </View>
                    <Pressable onPress = {() => setImg(null)}>
                        <Feather name="x" size={25} color="#595959" style = {{margin: 5}} />
                    </Pressable>
                </View>
            )}

            { audioUri && (<MusicPlayer audioUri = {audioUri} />)}

            <View style = {styles.inputRow}>
                <View style = {styles.inContainer}>
                    <Pressable onPress = {() => setEmojiOpen((currentValue) => !currentValue)}>
                        <FontAwesome5 name="smile-beam" size={20} color="#595959" style = {styles.icon} />
                    </Pressable>
                    <TextInput 
                        style = {styles.tInput}
                        value = {message}
                        onChangeText = {setMessage}
                        placeholder = "Message..." 
                    />
                    <Pressable onPress = {pickImg}>
                        <Feather name="image" size={20} color="#595959" style = {styles.icon} />
                    </Pressable>
                    <Pressable onPress = {photo}>
                        <Feather name="camera" size={20} color="#595959" style = {styles.icon} />
                    </Pressable>
                    <Pressable onPressIn = {recordingStart} onPressOut = {recordingStop}>
                        <Feather name="mic" size={20} color={ record ? "#008080" : "#595959"} style = {styles.icon} />
                    </Pressable>
                </View>
                <Pressable onPress = {onClick} style = {styles.btnContainer}>
                    {message || img || audioUri ? <Feather name="send" size={20} color="white" /> : <Feather name="plus" size={24} color="white" />}
                </Pressable>
            </View>

            { emojiOpen &&  (<EmojiSelector onEmojiSelected = {emoji => setMessage(currMsg => currMsg + emoji)} columns = {8} />) }
        </KeyboardAvoidingView>
    )
}

export default ChatMessageInput;