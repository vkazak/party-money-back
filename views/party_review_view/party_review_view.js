import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import makeFullUrl from '../../utils';
import AddPaymentOverlay from './add_payment_overlay';
import AddUsersOverlay from './add_users_overlay';
import { PartyPaymentsList } from './party_payments_list';
import PartyUsersList from './party_users_list';
import DebtsOverlay from './debts_overlay';
import { BodyContainer } from '../../components/component_containers';

const PartyReviewView = (props) => {

    const party = props.route.params.party;
    const user = props.route.params.user;
    
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isAddUsersVisible, setAddUsersVisible] = useState(false);
    const [isAddPaymentVisible, setAddPaymentVisible] = useState(false);
    const [isDebtsVisible, setDebtsVisible] = useState(true);
    
    useEffect(() => {
        axios.get(makeFullUrl(`/users/by_party/${party._id}`))
            .then(response => {
                setUsers(response.data);
            })
            .catch(err => console.log(err));

        axios.get(makeFullUrl(`/payments/by_party/${party._id}`))
            .then(response => {
                setPayments(response.data.sort(
                    (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
                ));
            })
    }, []);

    const addUsersToList = (newUsers) => {
        setUsers(users.slice().concat(newUsers))
    }
    const addPaymentToList = (payment) => {
        setPayments([payment].concat(payments));
    }

    return (
        <BodyContainer>
            <View>
                <PartyPaymentsList 
                    payments={payments}
                    user={user}
                    onAdd={() => setAddPaymentVisible(true)}
                />
                <PartyUsersList 
                    style={{ paddingVertical: 16 }} 
                    users={users}
                    onAdd={() => setAddUsersVisible(true)}
                />
            </View>
            <AddUsersOverlay
                isVisible={isAddUsersVisible}
                partyUsers={users}
                addUsersToList={addUsersToList}
                onClose={() => setAddUsersVisible(false)}
                partyId={party._id}
            />
            <AddPaymentOverlay
                isVisible={isAddPaymentVisible}
                addPaymentToList={addPaymentToList}
                onClose={() => setAddPaymentVisible(false)}
                partyId={party._id}
                partyUsers={users}
                defaultUserId={user._id}
            />
            <DebtsOverlay
                isVisible={isDebtsVisible}
                onClose={() => setDebtsVisible(false)}
                partyId={party._id}
                users={users}
                payments={payments}
            />
        </BodyContainer>
    )
}

const style = StyleSheet.create({
    button: {
        height: 60,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonTitle: {
        textAlign: "right",
        color: "grey",
        fontWeight: "500",
        shadowColor: "grey",
        shadowOpacity: 0.9,
        shadowRadius: 2,
        shadowOffset: {width: 0, height: 0},
        opacity: 0.5
    }
});

export default PartyReviewView;