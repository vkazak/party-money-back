import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ListItem, Button, Icon } from 'react-native-elements';
import commonStyles, { MAIN_COLOR } from './common-styles';
import axios from 'axios';
import makeFullUrl from '../utils';
import PMBOverlay from './pmb-overlay';

const PartyUsersList = (props) => {

    const renderUserItem = ({item}) => {
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
            style={[commonStyles.block, props.style]}
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
            style={[commonStyles.block, props.style]}
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

const AddUsersOverlay = (props) => {
    const [users, setUsers] = useState([]);
    const [checked, setChecked] = useState(new Set());
    const [showSavingView, setSavingView] = useState(false);
    const [showDoneView, setDoneView] = useState(false);
    const [showErrorView, setErrorView] = useState(false);

    const clearStates = () => {
        setSavingView(false);
        setDoneView(false);
        setErrorView(false);
    }

    useEffect(() => {
        axios.get(makeFullUrl('/users'))
            .then(response => {
                const allUsers = response.data;
                console.log(props);
                const filterFn = (user) => !props.partyUsers.some(partyUser => partyUser._id == user._id);
                const usersNotInParty = allUsers.filter(filterFn);
                setUsers(usersNotInParty)
            })
            .catch(err => console.log(err));
    }, []);

    const onClose = () => {
        props.onClose();
        clearStates();
    }

    const onSave = () => {

    }

    const renderUserItem = ({item}) => {
        return(
            <ListItem 
                title={item.name}
                subtitle={item.email}
                leftAvatar={{
                    source: require('../src-files/default-avatar.png'),
                    rounded: true
                }}
                checkBox={{
                    checked: checked.has(item._id),
                    onPress: () => {
                        const checkedItem = checked.has(item._id);
                        setChecked(checkedItem ? checked.delete(item._id) : checked.add(item._id))
                    }
                }}
            />
        );
    }

    return(
        <PMBOverlay
            title='Add users to the party'
            isVisible={props.isVisible}
            onClose={onClose}
            onSave={onSave}
            showSavingView={showSavingView}
            showDoneView={showDoneView}
            showErrorView={showErrorView}
        >
            <FlatList
                style={{marginBottom: 10}}
                data={users}
                renderItem={renderUserItem}
                keyExtractor={user => user._id}
            />
        </PMBOverlay>
    )
}

const PartyReview = (props) => {

    const party = props.route.params.party;

    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isAddUsersVisible, setAddUsersVisible] = useState(false);
    const [isAddPaymentVisible, setAddPaumentVisible] = useState(false);
    
    useEffect(() => {
        axios.get(makeFullUrl(`/users/by_party/${party._id}`))
            .then(response => {
                setUsers(response.data);
                console.log(response.data);
            })
            .catch(err => console.log(err));

        axios.get(makeFullUrl(`/payments/by_party/${party._id}`))
            .then(response => {
                setPayments(response.data);
            })
            .catch(err => console.log(err));
    }, []);

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
                onClose={() => setAddUsersVisible(false)}
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

export default PartyReview;