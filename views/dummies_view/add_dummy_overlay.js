import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import PMBOverlay from '../../components/pmb_overlay';
import { UserContext } from '../../context/user_context';
import { Dummy } from '../../entities/dummy.entity';

const AddDummyOverlay = (props) => {
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
            const dummy = new Dummy({ name });
            dummy.create(currentUser)
                .then(dummy => {
                    props.updateDummies();
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
            setErrorMsg('Enter a valid name for a dummy')
        }
    }

    const onClose = () => {
        setName("");
        setErrorMsg("");
        props.onClose();
    };

    return (
        <PMBOverlay
            title='Add a new dummy'
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
                label='Dummy user name'
                placeholder='Vovan'
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

export default AddDummyOverlay;