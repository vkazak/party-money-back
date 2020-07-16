import { Picker } from '@react-native-community/picker';
import axios from 'axios';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from 'react-native-elements';
import PMBOverlay from '../../components/pmb_overlay';
import makeFullUrl from '../../utils';

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
                                <Picker.Item label={user.name} value={user._id} key={user._id}/>
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

export default AddPaymentOverlay;