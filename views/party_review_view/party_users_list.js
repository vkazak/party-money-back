import React from 'react';
import { FlatList, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import commonStyles from '../../styles';
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
                subtitleStyle={{opacity: 0.3, fontSize: 13}}
            />
        )
    }

    return (
        <View>
            <ListHeader 
                title='Users'
                onPress={props.onAdd}
            />
            <View style={commonStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden',}}>
                    {props.users.map(user => {
                        return(renderUserItem({item: user}))
                    })}
                </View>
            </View>
        </View>
    )
}

export default PartyUsersList;