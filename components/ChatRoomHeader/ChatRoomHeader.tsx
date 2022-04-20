import React, { useState, useEffect } from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DataStore } from '@aws-amplify/datastore';
import { Auth } from 'aws-amplify';
import { User, ChatRoomUser } from '../../src/models';

const ChatRoomHeader = ({ id, children }) => {
    const { width } = useWindowDimensions();
    const [user, setUser] = useState<User|null>(null);

    useEffect(() => {
        if(!id) {
            return;
        }

        const getUsers = async () => {
            const gotUsers = (await DataStore.query(ChatRoomUser)).filter(ChatRoomUser => ChatRoomUser.chatRoom.id == id).map((ChatRoomUser) => ChatRoomUser.user);
            const currAuthUser = await Auth.currentAuthenticatedUser();
            setUser(gotUsers.find((user) => user.id !== currAuthUser.attributes.sub) || null);
        };
        getUsers();
    }, []);

    return (
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', width: width - 75, marginRight: 0, padding: 10, alignItems: 'center'}}>
            <Image 
                source = {{uri: user?.imageUri}}
                style = {{width: 30, height: 30, borderRadius: 30}}
            />
            <Text style = {{color: 'white', fontWeight: 'bold', flex: 1, marginLeft: 10}}>{user?.name}</Text>
            <View style = {{flexDirection: 'row', padding: 10}}>
                <Feather name="video" size={20} color="white" style = {{marginHorizontal: 5}} />
                <Feather name="phone-call" size={20} color="white" style = {{marginHorizontal: 5}} />
            </View>
        </View>
    )
}

export default ChatRoomHeader