import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ListItem, Button, Icon, Input } from 'react-native-elements';
import commonStyles, { MAIN_COLOR } from './common-styles';
import axios from 'axios';
import makeFullUrl from '../utils';
import PMBOverlay from './pmb-overlay';
import { Picker } from '@react-native-community/picker';

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

const UserAndCheckBoxItem = (props) => {
    const [checked, setChecked] = useState(false);
    const item = props.item;
    const checkedUsers = props.checkedUsers;

    return(
        <ListItem 
            title={item.name}
            subtitle={item.email}
            leftAvatar={{
                source: require('../src-files/default-avatar.png'),
                rounded: true
            }}
            checkBox={{
                checked: checked,
                onPress: () => {
                    checked ? checkedUsers.delete(item._id) : checkedUsers.add(item._id)
                    setChecked(!checked)
                }
            }}
        />
    );
}

const AddUsersOverlay = (props) => {
    const [users, setUsers] = useState([]);
    const [showSavingView, setSavingView] = useState(false);
    const [showDoneView, setDoneView] = useState(false);
    const [showErrorView, setErrorView] = useState(false);

    const checkedUsers = new Set();

    const clearStates = () => {
        setSavingView(false);
        setDoneView(false);
        setErrorView(false);
        checkedUsers.clear();
    }

    useEffect(() => {
        axios.get(makeFullUrl('/users'))
            .then(response => {
                const allUsers = response.data;
                const filterFn = (user) => 
                    !props.partyUsers.some(partyUser => partyUser._id == user._id);
                const usersNotInParty = allUsers.filter(filterFn);
                setUsers(usersNotInParty);
            })
            .catch(err => console.log(err));
    }, [props.partyUsers]);

    const onClose = () => {
        props.onClose();
        clearStates();
    }

    const addUsersToTheParty = async () => {
        const checkedUsersArr = Array.from(checkedUsers);
        const addUserToPartyPromises = checkedUsersArr.map(userId => 
            axios.post(makeFullUrl(`/parties/adduser`), {userId, partyId: props.partyId})
        );
        const addedPartyUsers = await Promise.all(addUserToPartyPromises);
        return (addedPartyUsers.map(pu => pu.data));
    }

    const onSave = () => {
        setSavingView(true);
        addUsersToTheParty()
            .then(addedPartyUsers => {
                const addedUsers = addedPartyUsers.map(partyUser => 
                    users.find(user => user._id == partyUser.userId)
                );
                props.addUsersToList(addedUsers);
                setDoneView(true);
            })
            .catch(err => {
                setErrorView(true);
                console.log(err);
            })
            .then(() => {
                setTimeout(() => {
                    onClose()
                }, 1000);
            })
    }

    const renderUserItem = ({item}) => {
        return (
            <UserAndCheckBoxItem
                item={item}
                checkedUsers={checkedUsers}
            />
        )
    }

    return(
        <PMBOverlay
            title='Add users to the party'
            saveTitle='Add'
            isVisible={props.isVisible}
            onClose={onClose}
            onSave={onSave}
            showSavingView={showSavingView}
            showDoneView={showDoneView}
            showErrorView={showErrorView}
        >
            <View style={{marginBottom: 10, height: 300}}>
                
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={user => user._id}
                />
            </View>
        </PMBOverlay>
    )
}

const AddPaymentOverlay = (props) => {
    const [userId, setUserId] = useState(props.defaultUserId);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [showSavingView, setSavingView] = useState(false);
    const [showDoneView, setDoneView] = useState(false);
    const [showErrorView, setErrorView] = useState(false);

    const clearStates = () => {
        setSavingView(false);
        setDoneView(false);
        setErrorView(false);
        setUserId(props.defaultUserId);
        setDescription("");
        setAmount(0);
    }

    const onClose = () => {
        props.onClose();
        clearStates();
    }

    const onSave = () => {
        setSavingView(true);
        axios.post(makeFullUrl(`/payments/add`), 
            {userId, partyId: props.partyId, description, amount}
        )
            .then(response => {
                const payment = response.data;
                props.addPaymentToList(payment);
                setDoneView(true);
            })
            .catch(err => {
                setErrorView(true);
                console.log(err);
            })
            .then(() => {
                setTimeout(() => {
                    onClose()
                }, 1000);
            })
    }

    return(
        <PMBOverlay
            title='Add new payment'
            saveTitle='Add'
            isVisible={props.isVisible}
            onClose={onClose}
            onSave={onSave}
            showSavingView={showSavingView}
            showDoneView={showDoneView}
            showErrorView={showErrorView}
        >
            <View>
                <Picker 
                    mode='dropdown'
                    selectedValue={userId}
                    onValueChange={(userId, itemIndex) =>
                        setUserId(userId)
                    }
                >
                    {
                        props.partyUsers.map((user) => {
                            return(
                                <Picker.Item label={user.name} value={user._id} />
                            )
                        })
                    }
                </Picker>
                <Input
                    label='Amount of money'
                    onChangeText={text => setAmount(Number(text))}
                    labelStyle={{ fontWeight: "500"}}
                    keyboardType='number-pad'
                    returnKeyType='done'
                />
                <Input
                    label='Payment desription'
                    placeholder='Description...'
                    onChangeText={text => setDescription(text)}
                    labelStyle={{ fontWeight: "500"}}
                />
            </View>
        </PMBOverlay>
    )
}

const PartyReview = (props) => {

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

export default PartyReview;