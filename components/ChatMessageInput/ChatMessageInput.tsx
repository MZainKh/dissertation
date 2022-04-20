import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { Auth, Storage } from 'aws-amplify';
import { Message } from '../../src/models';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { ChatRoom } from '../../src/models';
import EmojiSelector from 'react-native-emoji-selector';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const ChatMessageInput = ({ chatRoom }) => {
    const [message, setMessage] = useState('');
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [img, setImg] = useState<string|null>(null);
    const [prog, setProg] = useState(0);
    
    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const libResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();
                const imgResponse = await ImagePicker.requestCameraPermissionsAsync();
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

        const imgBlob = await getImgBlob();
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

    const getImgBlob = async () => {
        if (!img) {
            return null;
        }
        const responseImg = await fetch(img);
        const imgBlob  = await responseImg.blob();
        return imgBlob;
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
                    <Feather name="mic" size={20} color="#595959" style = {styles.icon} />
                </View>
                <Pressable onPress = {onClick} style = {styles.btnContainer}>
                    {message || img ? <Feather name="send" size={20} color="white" /> : <Feather name="plus" size={24} color="white" />}
                </Pressable>
            </View>

            { emojiOpen &&  (<EmojiSelector onEmojiSelected = {emoji => setMessage(currMsg => currMsg + emoji)} columns = {8} />) }
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create ({
    root: {
        padding: 10,
        height: '50%'
    },
    inputRow: {
        flexDirection: 'row'
    },
    inContainer: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        flex: 1,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'grey',
        alignItems: 'center',
        padding: 5
    },
    icon: {
        marginHorizontal: 5
    },
    tInput: {
        flex: 1,
        marginHorizontal: 5
    },
    btnContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#008080',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: 'white',
        fontSize: 35
    },
    selectedImgContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 10
    }
})

export default ChatMessageInput