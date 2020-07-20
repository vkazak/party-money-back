import React from 'react';
import { FlatList, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import listStyles from '../../styles';
import { ListHeader } from './party_payments_list';

const PartyUsersList = (props) => {

    const renderUserItem = ({item}) => {
        return (
            <ListItem 
                title={item.name}
                subtitle={item.email}
                leftAvatar={{
                    source: require('../../src_files/default-avatar.png'),
                    rounded: true
                }}
            />
        )
    }

    return (
        <View>
            <ListHeader 
                title='Users'
                onPress={props.onAdd}
            />
            <FlatList
                style={[listStyles.block, props.style]}
                data={props.users}
                renderItem={renderUserItem}
                keyExtractor={user => user._id}
            /> 
        </View>
    )
}

export default PartyUsersList;