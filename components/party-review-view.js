import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import commonStyles from './common-styles';
import axios from 'axios';
import makeFullUrl from '../utils';

const PartyUsersList = (props) => {

    const renderUserItem = ({item}) => {
        console.log(item);
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
            style={commonStyles.block}
            data={props.users}
            renderItem={renderUserItem}
            keyExtractor={user => user._id}
        />
    )
}

const PartyPaymentsList = (props) => {

    const renderPaymentItem = ({item}) => {
        return (
            <ListItem 
                title={item.description}
                subtitle={item.amount}
            />
        )
    }

    return (
        <FlatList
            style={commonStyles.block}
            data={props.payments}
            renderItem={renderPaymentItem}
            keyExtractor={payment => payment._id}
        />
    )
}

const PartyReview = (props) => {

    const party = props.route.params.party;;

    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    
    useEffect(() => {
        axios.get(makeFullUrl(`/users/by_party/${party._id}`))
            .then(response => {
                setUsers(response.data);
            })
            .catch(err => console.log(err));

        axios.get(makeFullUrl(`/payments/by_party/${party._id}`))
            .then(response => {
                console.log(response.data);
                setPayments(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <View>
            <PartyUsersList users={users}/>
            <PartyPaymentsList payments={payments}/>
        </View>
    )
}

export default PartyReview;