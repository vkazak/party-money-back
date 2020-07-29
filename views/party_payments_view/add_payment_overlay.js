import { Picker } from '@react-native-community/picker';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Input } from 'react-native-elements';
import PMBOverlay from '../../components/pmb_overlay';
import { LoadIndicatorView } from '../../components/component_containers';
import { Payment } from '../../entities/payment.entity';
import { UserContext } from '../../context/user_context';

const AddPaymentOverlay = (props) => {
    const currentUser = React.useContext(UserContext);
    
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [pickedUserId, setUserId] = useState(currentUser._id);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [showSavingView, setSavingView] = useState(false);
    const [showDoneView, setDoneView] = useState(false);
    const [showErrorView, setErrorView] = useState(false);

    const party = props.party;

    const onDataLoaded = (users) => {
        setUsers(users);
        setLoading(false);
    }
    const loadMembers = () => {
        party.getUsersAndDummiesAsUsers()
            .then(onDataLoaded)
            .catch(console.log);
    };
    useEffect(() => {
        if (props.isVisible) {
            loadMembers();
        }
    }, [props.isVisible]);

    const clearStates = () => {
        setSavingView(false);
        setDoneView(false);
        setErrorView(false);
        setUserId(currentUser._id);
        setDescription("");
        setAmount(0);
    }

    const onClose = () => {
        props.onClose();
        clearStates();
    }

    const onSave = () => {
        setSavingView(true);
        const user = users.find(user => user._id == pickedUserId);
        const payment = new Payment({party, user, description, amount});
        payment.create()
            .then(payment => {
                props.updatePayments();
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
            <LoadIndicatorView isLoading={loading}>
                <Picker 
                    mode='dropdown'
                    selectedValue={pickedUserId}
                    onValueChange={(userId, itemIndex) =>
                        setUserId(userId)
                    }
                >
                    {
                        users.map((user) => {
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
            </LoadIndicatorView>
        </PMBOverlay>
    )
}

export default AddPaymentOverlay;