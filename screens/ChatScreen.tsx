import React from "react";
import { Text, View, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/core";
import ChatMessage from "../components/ChatMessage";
import chatData from "../assets/Chats";
import ChatMessageInput from "../components/ChatMessageInput";

export default function ChatScreen() {
    const route = useRoute();
    const navigation = useNavigation();

    navigation.setOptions({title: 'Gojo Satoru'})

    return (
        <SafeAreaView style = {styles.page}>
            <FlatList
                data = {chatData.messages}
                renderItem = {({ item: chatData }) => <ChatMessage message = {chatData} />} 
                inverted
            />
            <ChatMessageInput />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create ({
    page: {
        backgroundColor: '#000000',
        flex: 1
    }
});