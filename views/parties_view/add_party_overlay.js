import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import PMBOverlay from '../../components/pmb_overlay';
import { Party } from '../../entities/party.entity';
import { UserContext } from '../../context/user_context';

const AddPartyOverlay = (props) => {
    const currentUser = React.useContext(UserContext);
    
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
            const party = new Party({ name });
            party.create(props.currentUser)
                .then(party => {
                    props.updateParties();
                    setDoneView(true);
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