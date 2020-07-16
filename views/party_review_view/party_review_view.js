import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Icon, ListItem } from 'react-native-elements';
import listStyles from '../../styles';
import makeFullUrl from '../../utils';
import AddPaymentOverlay from './add_payment_overlay';
import AddUsersOverlay from './add_users_overlay';

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
        <FlatList
            style={[listStyles.block, props.style]}
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
                subtitle={item.amount.toString()}
            />
        )
    }

    return (
        <FlatList
            style={[listStyles.block, props.style]}
            data={props.payments}
            renderItem={renderPaymentItem}
            keyExtractor={payment => payment._id}
        />
    )
}

const PartyButton = (props) => {
    return(
        <Button 
            style={style.button}
            titleStyle={style.buttonTitle}
            icon={<Icon
                style={style.buttonTitle}
                name={props.iconName}
                color="grey"
                size={40}
            />}
            title={props.title}
            type="clear"
            onPress={props.onPress}
        />
    )
}

const PartyReviewView = (props) => {

    const party = props.route.params.party;
    const user = props.route.params.user;
    
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isAddUsersVisible, setAddUsersVisible] = useState(false);
    const [isAddPaymentVisible, setAddPaymentVisible] = useState(false);
    
    useEffect(() => {
        axios.get(makeFullUrl(`/users/by_party/${party._id}`))
            .then(response => {
                setUsers(response.data);
            })
            .catch(err => console.log(err));

        axios.get(makeFullUrl(`/payments/by_party/${party._id}`))
            .then(response => {
                setPayments(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    const addUsersToList = (newUsers) => {
        setUsers(users.slice().concat(newUsers))
    }
    const addPaymentToList = (payment) => {
        setPayments([payment].concat(payments));
    }

    return (
        <View style={style.container}>
            <View>
                <PartyButton 
                    title="Add user"
                    iconName="add"
                    onPress={() => setAddUsersVisible(true)}
                /> 
                <PartyButton 
                    title="Add payment"
                    iconName="add"
                    onPress={() => setAddPaymentVisible(true)}
                /> 
            </View>
            <View>
                <PartyUsersList 
                    style={{ paddingVertical: 16 }} 
                    users={users}
                />
                <PartyPaymentsList 
                    style={{ paddingVertical: 16 }} 
                    payments={payments}
                />
            </View>
            <AddUsersOverlay
                isVisible={isAddUsersVisible}
                partyUsers={users}
                addUsersToList={addUsersToList}
                onClose={() => setAddUsersVisible(false)}
                partyId={party._id}
            />
            <AddPaymentOverlay
                isVisible={isAddPaymentVisible}
                addPaymentToList={addPaymentToList}
                onClose={() => setAddPaymentVisible(false)}
                partyId={party._id}
                partyUsers={users}
                defaultUserId={user._id}
            />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        height: 60,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonTitle: {
        textAlign: "right",
        color: "grey",
        fontWeight: "500",
        shadowColor: "grey",
        shadowOpacity: 0.9,
        shadowRadius: 2,
        shadowOffset: {width: 0, height: 0},
        opacity: 0.5
    }
});

export default PartyReviewView;