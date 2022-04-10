import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import React, { useState } from 'react';

const ChatMessageInput = () => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        console.warn("sending: ", message);
        setMessage('');
    }

    const onPlusClicked = () => {
        console.warn("Plus Clicked");
    }

    const onClick = () => {
        if (message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
    }

    return (
        <KeyboardAvoidingView 
            behavior = {Platform.OS == "ios" ? "padding" : "height"} 
            keyboardVerticalOffset = {100}
            style = {styles.root}
        >
            <View style = {styles.inContainer}>
                <FontAwesome5 name="smile-beam" size={20} color="#595959" style = {styles.icon} />
                <TextInput 
                    style = {styles.tInput}
                    value = {message}
                    onChangeText = {setMessage}
                    placeholder = "Message..." 
                />
                <Feather name="camera" size={20} color="#595959" style = {styles.icon} />
                <Feather name="mic" size={20} color="#595959" style = {styles.icon} />
            </View>
            <Pressable onPress = {onClick} style = {styles.btnContainer}>
                {message ? <Feather name="send" size={20} color="white" /> : <Feather name="plus" size={24} color="white" />}
            </Pressable>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create ({
    root: {
        flexDirection: 'row',
        padding: 10,
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
    }
})

export default ChatMessageInput