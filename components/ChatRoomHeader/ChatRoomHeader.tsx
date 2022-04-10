import { View, Text, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React from 'react';

const ChatRoomHeader = (props) => {
    const { width } = useWindowDimensions();

    return (
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', width: width - 75, marginRight: 0, padding: 10, alignItems: 'center'}}>
            <Image 
                source = {{uri: 'https://media-exp1.licdn.com/dms/image/C4D03AQFTPuDq7goAWA/profile-displayphoto-shrink_200_200/0/1624307361427?e=1654732800&v=beta&t=XibugeXdyfrSaUgw7df0RvS_KRghIsxpL-iz9TPy4pw'}}
                style = {{width: 30, height: 30, borderRadius: 30}}
            />
            <Text style = {{color: 'white', fontWeight: 'bold', flex: 1, marginLeft: 10}}>{props.children}</Text>
            <View style = {{flexDirection: 'row', padding: 10}}>
                <Feather name="video" size={20} color="white" style = {{marginHorizontal: 5}} />
                <Feather name="phone-call" size={20} color="white" style = {{marginHorizontal: 5}} />
            </View>
        </View>
    )
}

export default ChatRoomHeader