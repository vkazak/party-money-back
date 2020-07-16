import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import listStyles, { APP_GREEN, APP_RED } from '../../styles';

const PaymentCard = (props) => {
    const payment = props.payment;
    const currentUserId = props.currentUserId;

    const buildUserLine = () => {
        return(
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar
                    rounded
                    source={require('../../src_files/default-avatar.png')}
                    size={20}
                />
                <Text style={{ paddingLeft: 8 }}>{payment.user.name}</Text>
            </View>
        )
    }

    const amountColor = payment.user._id == currentUserId ? APP_GREEN : APP_RED;
    const amountStyle = [style.amount, { color: amountColor }]

    return (
        <View style={[style.paymentCardContainer, listStyles.block]}>
            <Text style={amountStyle}>{payment.amount.toString()}</Text>
            <Divider/>
            <View style={{flexDirection: 'column'}}>
                {buildUserLine()}
                <Text style={style.description} numberOfLines={4} ellipsizeMode='tail'>
                    {payment.description}
                </Text>
            </View>
        </View>
    )
}

const PartyPaymentsList = (props) => {
    const currentUserId = props.user._id;

    const renderPaymentItem = ({item}) => {
        return (
            <PaymentCard
                payment={item}
                currentUserId={currentUserId}
               /* button={{ title: 'GET STARTED', icon: 'flight-takeoff' }}*/
            />
        )
    }

    return (
        <FlatList
            style={[listStyles.block, props.style]}
            data={props.payments}
            renderItem={renderPaymentItem}
            keyExtractor={payment => payment._id}
            horizontal
        />
    )
}

const style = StyleSheet.create({
    paymentCardContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 8,
        marginRight: 8,
        marginVertical: 8,
        height: 80,
        width: 200,
        alignItems: 'center'
    },
    amount: {
        fontSize: 30,
        fontWeight: '700',
        opacity: 0.9
    },
    description: {
        fontSize: 15,
        fontWeight: '400',
        color: 'grey',
        opacity: 0.7
    }
});

export default PartyPaymentsList;