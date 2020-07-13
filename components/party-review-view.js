import React, { useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const PartyUsersList = (...props) => {

    const renderUserItem = (item) => {
        return (
            <ListItem 
                title={item.name}
                subtitle={item.email}
                leftAvatar={{
                    source: require('../src-files/default-avatar.png'),
                    rounded: true
                }}
            />
        )
    }

    return (
        <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={user => user._id}
        />
    )
}

const PartyReview = (props) => {

    const party = lala;

    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);

    return (
        <View>
            <PartyUsersList users/>
            <PaymentsList/>
        </View>
    )
}

export default PartyReview;