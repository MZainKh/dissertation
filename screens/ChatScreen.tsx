import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/core";
import { DataStore } from "@aws-amplify/datastore";
import { Auth, SortDirection } from "aws-amplify";
import { Message, ChatRoom } from "../src/models";
import ChatMessage from "../components/ChatMessage";
import ChatMessageInput from "../components/ChatMessageInput";

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatRoom, setChatRoom] = useState<ChatRoom|null>(null);
    
    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        getChatRoom();
    }, []);

    useEffect(() => {
        getMessages();
    }, [chatRoom])

    useEffect(() => {
        const realTimeSub = DataStore.observe(Message).subscribe(msg => {
            console.log(msg.model, msg.opType, msg.element);
            if(msg.model == Message && msg.opType == "INSERT") {
                setMessages((existingMessages) => [msg.element, ...existingMessages]);
            }
        });
        return () => realTimeSub.unsubscribe();
    }, []);

    const getChatRoom = async () => {
        if(!route.params?.id) {
            console.warn("no such chatRoom found!");
            return;
        }
        const getChatRoom = await DataStore.query(ChatRoom, route.params.id);
        if(!getChatRoom) {
            console.error("chatRoom with this id not found!");
        } else {
            setChatRoom(getChatRoom);
        }
    };

    const getMessages = async () => {
        if(!chatRoom) {
            return;
        }
        const gotMessages = await DataStore.query(Message, message => message.chatroomID("eq", chatRoom?.id), {
            sort: message => message.createdAt(SortDirection.DESCENDING)
        });
        setMessages(gotMessages);
    };

    if(!chatRoom) {
        return <ActivityIndicator />
    }

    return (
        <SafeAreaView style = {styles.page}>
            <FlatList
                data = {messages}
                renderItem = {({ item }) => <ChatMessage message = {item} />} 
                inverted
            />
            <ChatMessageInput chatRoom = {chatRoom} />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create ({
    page: {
        backgroundColor: '#000000',
        flex: 1
    }
});