import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import PMBOverlay from '../../components/pmb_overlay';
import { AppStyles } from '../../styles';

const UserAndCheckBoxItem = (props) => {
    const [checked, setChecked] = useState(false);
    const item = props.item;
    const checkedUsers = props.checkedUsers;

    return(
        <ListItem 
            title={item.name}
            titleStyle={AppStyles.listTitle}
            subtitle={item.email}
            subtitleStyle={AppStyles.listSubtitle}
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
        const userOutOfPartyFn = (user) => !props.partyUsers.some(partyUser => partyUser._id == user._id);
        props.currentUser.getUsersAndDummiesAsUsers(userOutOfPartyFn)
            .then(setUsers)
            .catch(console.log);
    }, [props.partyUsers]);

    const onClose = () => {
        props.onClose();
        clearStates();
    }

    const onSave = () => {
        setSavingView(true);
        const findMemberById = (id) => users.find(user => user._id == id);
        const checkedMembers = Array.from(checkedUsers).map(findMemberById);
        props.party.addMembers(checkedMembers)
            .then(() => {
                props.updateUsers();
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
            });
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
            </View>
        </PMBOverlay>
    )
}

export default AddUsersOverlay;