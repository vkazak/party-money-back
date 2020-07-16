import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import PMBOverlay from '../../components/pmb_overlay';
import makeFullUrl from '../../utils';

const UserAndCheckBoxItem = (props) => {
    const [checked, setChecked] = useState(false);
    const item = props.item;
    const checkedUsers = props.checkedUsers;

    return(
        <ListItem 
            title={item.name}
            subtitle={item.email}
            leftAvatar={{
                source: require('../../src_files/default-avatar.png'),
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

export default AddUsersOverlay;