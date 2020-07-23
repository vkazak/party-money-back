import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import PMBOverlay from '../../components/pmb_overlay';
import { makeFullUrl } from '../../utils';

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
    const [dummies, setDummies] = useState([]);
    const [showSavingView, setSavingView] = useState(false);
    const [showDoneView, setDoneView] = useState(false);
    const [showErrorView, setErrorView] = useState(false);

    const checkedUsers = new Set();
    const checkedDummies = new Set();

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
        axios.get(makeFullUrl(`/dummies/by_user/${props.currentUserId}`))
            .then(response => {
                const usersDummies = response.data;
                const filterFn = (dummy) => 
                    !props.partyDummies.some(partyDummy => partyDummy._id == dummy._id);
                const dummiesNotInParty = usersDummies.filter(filterFn);
                setDummies(dummiesNotInParty);
            })
            .catch(err => console.log(err));
    }, [props.partyUsers, props.partyDummies]);

    const onClose = () => {
        props.onClose();
        clearStates();
    }

    const onSave = () => {
        setSavingView(true);
        const checkedUsersIds = Array.from(checkedUsers);
        const checkedDummiesIds = Array.from(checkedDummies);

        axios.post(
            makeFullUrl(`/parties/addmembers`), 
            {usersIds : checkedUsersIds, dummiesIds: checkedDummiesIds, partyId: props.partyId}
        )
            .then(() => {
                const addedUsers = checkedUsersIds.map(userId => 
                    users.find(user => user._id == userId)
                );
                const addedDummies = checkedDummiesIds.map(dummyId => 
                    dummies.find(dummy => dummy._id == dummyId)
                );
                props.addUsersToList(addedUsers);
                props.addDummiesToList(addedDummies);
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
    const renderDummyItem = ({item}) => {
        return (
            <UserAndCheckBoxItem
                item={item}
                checkedUsers={checkedDummies}
            />
        )
    }

    return(
        <PMBOverlay
            title='Add members to the party'
            saveTitle='Add'
            isVisible={props.isVisible}
            onClose={onClose}
            onSave={onSave}
            showSavingView={showSavingView}
            showDoneView={showDoneView}
            showErrorView={showErrorView}
        >
            <View style={{marginBottom: 10}}>
                
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={user => user._id}
                />
                <FlatList
                    data={dummies}
                    renderItem={renderDummyItem}
                    keyExtractor={dummy => dummy._id}
                />
            </View>
        </PMBOverlay>
    )
}

export default AddUsersOverlay;