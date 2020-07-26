import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Icon } from 'react-native-elements';
import { BodyContainer, ListContainer } from '../../components/component_containers';
import PMBDivider from '../../components/pmb_divider';
import { AppStyles, APP_COLOR, APP_FONT, APP_FONT_BOLD, APP_FONT_SEMIBOLD, APP_GREEN } from '../../styles';
import AddPaymentOverlay from './add_payment_overlay';
import DebtsOverlay from './debts_overlay';
import { UserContext } from '../../context/user_context';


const PaymentCard = (props) => {
    const currentUser = React.useContext(UserContext);
    const payment = props.payment;
    const isCurrentUser = payment.user._id == currentUser._id;

    const cardColor = isCurrentUser ? APP_GREEN : '#ffffff';
    const nameColor = isCurrentUser ? 'white' : '#00000090';
    const amountColor = isCurrentUser ? 'white' : APP_COLOR;
    const cardOpacity = 'a0';
    const backgroundColor = cardColor + cardOpacity;

    return (
        <View style={AppStyles.block}>
            <View style={[{backgroundColor}, style.paymentCardContainer]}>
                <View style={style.leftBox}>
                    <View style={style.userBox}>
                        <Avatar 
                            source={{ url: payment.user.photoUrl }}
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

    const currentUser = React.useContext(UserContext);
    const party = props.route.params.party;

    const loadMembers = () => {
        party.getUsersAndDummiesAsUsers()
            .then(setUsers)
            .catch(console.log);
    }
    const loadPayments = () => {
        party.getPayments()
            .then(setPayments)
            .catch(console.log);
    }

    useEffect(() => {
        loadMembers();
        loadPayments();
    }, []);

    const renderPaymentItem = ({item}) => {
        return (
            <PaymentCard
                payment={item}
                currentUserId={currentUser._id}
                key={item._id}
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
                containerStyle={AppStyles.floatingIconButton}
                name='add'
                color={APP_COLOR}
                onPress={() => setAddPaymentVisible(true)}
                reverse
            />
            <AddPaymentOverlay
                isVisible={isAddPaymentVisible}
                updatePayments={loadPayments}
                onClose={() => setAddPaymentVisible(false)}
                party={party}
                partyUsers={users}
            />
            <DebtsOverlay
                isVisible={isDebtsVisible}
                onClose={() => setDebtsVisible(false)}
                party={party}
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