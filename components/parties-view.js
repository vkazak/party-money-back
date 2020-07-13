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

    const onSave = () => {
        if (name) {
            axios.post(makeFullUrl('/parties/add'), {name})
                .then(response => {
                    const party = response.data;
                    props.addPartyToTheList(party);
                    const partyUser = {partyId: party._id, userId: props.userId};
                    axios.post(makeFullUrl(`/parties/adduser`), partyUser)
                        .then(response => props.onClose())
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        }
        else {
            setErrorMsg('Enter a valid name for a party')
        }
    }

    return (
        <PMBOverlay
            title='Add a new party'
            isVisible={props.isVisible}
            onClose={props.onClose}
            onSave={onSave}
            
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

    const userId = props.route.params.user._id;
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
        return(
            <ListItem 
                title={item.name}
                chevron
            />
        );
    }

    const addPartyToTheList = (party) => {
        setParties(parties.slice().concat([party]));
    }

    return(
        <View style={{flex:1}}>
            <FlatList 
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