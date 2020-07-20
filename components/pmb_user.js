import React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';

const PMBUser = (props) => {
    return(
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
            <Avatar
                rounded
                source={require('../src_files/default-avatar.png')}
                size={20}
            />
            <Text style={{ paddingLeft: 8, opacity: 0.5 }}>{props.user.name}</Text>
        </View>
    )
}

export default PMBUser;