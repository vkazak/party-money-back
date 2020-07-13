import React, { useState, useEffect } from 'react';
import {Text, Image, FlatList, View, StyleSheet, TouchableHighlight} from 'react-native';
import axios from 'axios';
import makeFullUrl from '../utils';
import { ListItem, Icon, Overlay, Input, Button } from 'react-native-elements';
import commonStyles from './common-styles';

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
        <Overlay animationType="fade" onBackdropPress={props.onClose} isVisible={props.isVisible}>
             <View style={{height:"80%", minWidth:"80%"}}>
                <Input
                    label='Party name'
                    placeholder='Scrinzh'
                    onChangeText={text => {
                        setName(text);
                        setErrorMsg("");
                    }}
                    errorStyle={{ color: 'red' }}
                    errorMessage={errorMsg}
                />
                <View>
                    <Button title="Save" onPress={onSave}/>
                    <Button title="Cancel" type="outline" onPress={props.onClose}/>
                </View>
            </View>
        </Overlay>
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
                style={{zIndex: 0}}
                data={parties}
                renderItem={renderPartyItem}
                keyExtractor={party => party._id}
            />
            <Icon 
                containerStyle={commonStyles.floatingIconButton}
                name='add'
                color='#007AFF'
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