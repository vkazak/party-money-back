import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeFullUrl } from '../../utils';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { Avatar, Button, Icon } from 'react-native-elements';
import commonStyles, { APP_GREEN, APP_FONT, APP_FONT_SEMIBOLD, APP_COLOR, APP_FONT_BOLD, APP_BLUE } from '../../styles';
import PMBDivider from '../../components/pmb_divider';
import { BodyContainer, ListContainer } from '../../components/component_containers';
import AddPaymentOverlay from './add_payment_overlay';
import DebtsOverlay from './debts_overlay';


const PaymentCard = (props) => {
    const payment = props.payment;
    const isDefaultUser = payment.user._id == props.currentUserId;

    const cardColor = isDefaultUser ? APP_GREEN : '#ffffff';
    const nameColor = isDefaultUser ? 'white' : '#00000090';
    const amountColor = isDefaultUser ? 'white' : APP_COLOR;
    const cardOpacity = 'a0';
    const backgroundColor = cardColor + cardOpacity;

    return (
        <View style={commonStyles.block}>
            <View style={[{backgroundColor}, style.paymentCardContainer]}>
                <View style={style.leftBox}>
                    <View style={style.userBox}>
                        <Avatar 
                            source={require('../../src_files/default-avatar.png')}
                            size={40}
                            rounded
                        />
                        <Text style={[style.userName, {color: nameColor}]}>{payment.user.name}</Text>
                    </View>
                    <View style={style.descriptionBox}>
                        <Text style={style.description} numberOfLines={3}>{payment.description}</Text>
                    </View>
                </View>
                <PMBDivider />
                <View style={style.amountBox}>
                    <Text style={[style.amount, {color: amountColor}]}>{payment.amount}</Text>
                </View>
            </View>
        </View>
    )
}

const PartyPaymentsView = (props) => {

    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [isAddPaymentVisible, setAddPaymentVisible] = useState(false);
    const [isDebtsVisible, setDebtsVisible] = useState(false);

    const currentUser = props.route.params.user;
    const party = props.route.params.party;

    useEffect(() => {
        axios.get(makeFullUrl(`/payments/by_party/${party._id}`))
            .then(response => {
                setPayments(response.data.sort(
                    (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
                ));
            })
        axios.get(makeFullUrl(`/users/by_party/${party._id}`))
            .then(response => {
                setUsers(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    const addPaymentToList = (payment) => {
        setPayments([payment].concat(payments));
    }

    const renderPaymentItem = ({item}) => {
        return (
            <PaymentCard
                payment={item}
                currentUserId={currentUser._id}
            />
        )
    }

    return (
        <BodyContainer>
            <View style={style.debtButtonBox}>
                <Button
                    title='Show summary'
                    titleStyle={style.debtButtonTitle}
                    buttonStyle={style.debtButton}
                    onPress={() => setDebtsVisible(true)}
                    raised
                />
            </View>
            <ListContainer style={{marginTop: 60}}>
                {payments.map(item => renderPaymentItem({item}))}
            </ListContainer>
            <Icon 
                containerStyle={commonStyles.floatingIconButton}
                name='add'
                color={APP_COLOR}
                onPress={() => setAddPaymentVisible(true)}
                reverse
            />
            <AddPaymentOverlay
                isVisible={isAddPaymentVisible}
                addPaymentToList={addPaymentToList}
                onClose={() => setAddPaymentVisible(false)}
                partyId={party._id}
                partyUsers={users}
                defaultUserId={currentUser._id}
            />
            <DebtsOverlay
                isVisible={isDebtsVisible}
                onClose={() => setDebtsVisible(false)}
                partyId={party._id}
                users={users}
                payments={payments}
                currentUser={currentUser}
            />
        </BodyContainer>
    )
}

const style = StyleSheet.create({
    paymentCardContainer: {
        flexDirection: 'row',
        flex: 1,
        maxHeight: 150,
        width: '100%',
        borderRadius: 15,
        padding: 8
    },
    debtButtonBox: {
        position: 'absolute',
        opacity: 0.7,
        width: '100%',
        top: 8,
        paddingHorizontal: 16,
        zIndex: 1,
    },
    debtButton: {
        backgroundColor: APP_GREEN,
        height: 60,
        borderRadius: 30,
    },
    debtButtonTitle: {
        fontFamily: APP_FONT
    },
    leftBox: {
        flex: 1,
    },
    userBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userName: {
        fontFamily: APP_FONT_SEMIBOLD,
        fontSize: 16,
        opacity: 1,
        marginLeft: 10,
    },
    descriptionBox: {
        backgroundColor: '#ffffff60',
        borderRadius: 15,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: 8,
    },
    description: {
        fontFamily: APP_FONT,
        fontSize: 15,
        opacity: 0.6
    },
    amountBox: {
        justifyContent: 'center',
        paddingHorizontal: 8
    },
    amount: {
        fontSize: 30,
        fontFamily: APP_FONT_BOLD,
        opacity: 0.9
    },
});

export default PartyPaymentsView;