import React, { useState } from 'react';
import axios from 'axios';
import makeFullUrl from '../../utils';
import { Input } from 'react-native-elements';
import PMBOverlay from '../../components/pmb_overlay';

const AddPartyOverlay = (props) => {
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
                    const request = {partyId: party._id, usersIds: [props.userId]};
                    return (axios.post(makeFullUrl(`/parties/addusers`), request))
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

export default AddPartyOverlay;