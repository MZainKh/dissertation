import { View, Text, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React from 'react';

const HomeHeader = (props) => {
    const { width } = useWindowDimensions();

    return (
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', width, padding: 10, alignItems: 'center'}}>
            <Image 
                source = {{uri: 'https://media-exp1.licdn.com/dms/image/C4D03AQFTPuDq7goAWA/profile-displayphoto-shrink_200_200/0/1624307361427?e=1654732800&v=beta&t=XibugeXdyfrSaUgw7df0RvS_KRghIsxpL-iz9TPy4pw'}}
                style = {{width: 30, height: 30, borderRadius: 30}}
            />
            <Text style = {{color: 'white', fontWeight: 'bold', textAlign: 'center', marginLeft: 20}}>ZenChat</Text>
            <View style = {{flexDirection: 'row', padding: 10}}>
                <Feather name="camera" size={20} color="white" style = {{marginHorizontal: 5}} />
                <Feather name="edit-2" size={20} color="white" style = {{marginHorizontal: 5}} />
            </View>
        </View>
    )
}

export default HomeHeader;