import React, { useState, useEffect } from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DataStore } from '@aws-amplify/datastore';
import { Auth } from 'aws-amplify';
import { User, ChatRoomUser, ChatRoom } from '../../src/models';
import moment from 'moment';

const ChatRoomHeader = ({ id, children }) => {
    const { width } = useWindowDimensions();
    const [user, setUser] = useState<User|null>(null);
    const [chat, setChat] = useState<ChatRoom|undefined>();
    // const [online, setOnline] = useState(false);

    const getUsers = async () => {
        const gotUsers = (await DataStore.query(ChatRoomUser)).filter(ChatRoomUser => ChatRoomUser.chatRoom.id == id).map((ChatRoomUser) => ChatRoomUser.user);
        const currAuthUser = await Auth.currentAuthenticatedUser();
        setUser(gotUsers.find((user) => user.id !== currAuthUser.attributes.sub) || null);
    };

    const getChatRooms = async () => {
        const gotChatRooms = await DataStore.query(ChatRoom, id);
        setChat(gotChatRooms);
    }

    useEffect(() => {
        if(!id) {
            return;
        }
        getUsers();
        getChatRooms();
    }, []);

    const lastSeenText = () => {
        // if last seen is less than 2 mins the user is displayed as online
        if (!user?.lastSeen) {
            return;
        }
        const lastSeenMilliSecs = moment().diff(moment(user.lastSeen));
        if (lastSeenMilliSecs < 2 * 60 * 1000) { // < 2 mins
            // setOnline(true);
            return 'Online';
        } else {
            return `Last Seen ${moment(user.lastSeen).fromNow()}`;
        }
    }

    return (
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', width: width - 75, marginRight: 0, padding: 10, alignItems: 'center'}}>
            <Image 
                source = {{uri: chat?.imageUri ? chat.imageUri : user?.imageUri}}
                style = {{width: 30, height: 30, borderRadius: 30}}
            />
            <View style = {{flex: 1, marginLeft: 10}}>
                <Text style = {{color: 'white', fontWeight: 'bold'}}>{chat?.name ? chat.name : user?.name}</Text>
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    {/* {online && (<View style = {{backgroundColor: 'green', width: 10, height: 10, borderRadius: 10, marginRight: 5}}></View>)} */}
                    <Text style = {{color: 'white'}}>{lastSeenText()}</Text>
                </View>
            </View>
            <View style = {{flexDirection: 'row', padding: 10}}>
                <Feather name="video" size={20} color="white" style = {{marginHorizontal: 5}} />
                <Feather name="phone-call" size={20} color="white" style = {{marginHorizontal: 5}} />
            </View>
        </View>
    )
}

export default ChatRoomHeader