import React, { useState, useEffect } from 'react';
import {Text, Image, FlatList, View, StyleSheet, TouchableHighlight} from 'react-native';
import axios from 'axios';
import makeFullUrl from '../utils';
import { ListItem, Icon, Overlay, Input, Button } from 'react-native-elements';
import commonStyles, { MAIN_COLOR } from './common-styles';
import PMBOverlay from './pmb-overlay';

const AddPartyDialog = (props) => {
    const [name, setName] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showSavingView, setSavingView] = useState(false);
    const [showDoneView, setDoneView] = useState(false);
    const [showErrorView, setErrorView] = useState(false);

    const clearStates = () => {
        setName("");
        setErrorMsg("");
        setSavingView(false);
        setDoneView(false);
        setErrorView(false);
    }

    const onSave = () => {
        if (name) {
            setSavingView(true);
            let party;

            axios.post(makeFullUrl('/parties/add'), {name})
                .then(response => {
                    party = response.data;
                    const partyUser = {partyId: party._id, userId: props.userId};
                    return (axios.post(makeFullUrl(`/parties/adduser`), partyUser))
                })
                .then(() => {
                    setDoneView(true);
                    props.addPartyToTheList(party);
                })
                .catch(err => {
                    setErrorView(true);
                    console.log(err);
                })
                .then(() => {
                    setTimeout(() => {
                        props.onClose();
                        clearStates()
                    }, 1000);
                })
        }
        else {
            setErrorMsg('Enter a valid name for a party')
        }
    }

    const onClose = () => {
        setName("");
        setErrorMsg("");
        props.onClose();
    };

    return (
        <PMBOverlay
            title='Add a new party'
            saveTitle='Add'
            isVisible={props.isVisible}
            onClose={onClose}
            onSave={onSave}
            showSavingView={showSavingView}
            showDoneView={showDoneView}
            showErrorView={showErrorView}
        >
            <Input
                containerStyle={{marginVertical: 30}}
                label='Party name'
                placeholder='Scrinzh'
                onChangeText={text => {
                    setName(text);
                    setErrorMsg("");
                }}
                labelStyle={{ fontWeight: "500"}}
                errorStyle={{ color: 'red' }}
                errorMessage={errorMsg}
            />
        </PMBOverlay>
    )
}

const PartiesList = (props) => {

    const user = props.route.params.user;
    const userId = user._id;

    const [parties, setParties] = useState([]);
    const [showAddDialog, setShow] = useState(false);
    
    useEffect(() => {
        axios.get(makeFullUrl(`/parties/by_user/${userId}`))
            .then(response => {
                setParties(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    const renderPartyItem = ({item}) => {
        const onPress = () => {
            props.navigation.navigate("Party review", {party: item, user})
        };
        return(
            <ListItem 
                title={item.name}
                onPress={onPress}
                chevron
            />
        );
    }

    const addPartyToTheList = (party) => {
        setParties(parties.slice().concat([party]));
    }

    return(
        <View style={{flex: 1}}>
            <FlatList 
                style={commonStyles.block}
                data={parties}
                renderItem={renderPartyItem}
                keyExtractor={party => party._id}
            />
            <Icon 
                containerStyle={commonStyles.floatingIconButton}
                name='add'
                color={MAIN_COLOR}
                onPress={() => setShow(true)}
                reverse
            />
            <AddPartyDialog 
                isVisible={showAddDialog}
                onClose={() => setShow(false)}
                userId={userId}
                addPartyToTheList={addPartyToTheList}
            />
        </View>
    )
}

export default PartiesList;