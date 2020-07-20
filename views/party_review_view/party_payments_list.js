import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { Avatar, Button, Icon } from 'react-native-elements';
import listStyles, { APP_GREEN, APP_RED } from '../../styles';
import PMBDivider from '../../components/pmb_divider';
import PMBUser from '../../components/pmb_user';

const PartyButton = (props) => {
    return(
        <Button 
            style={style.button}
            icon={<Icon
                name='add'
                color='black'
                size={40}
            />}
            type='clear'
            onPress={props.onPress}
        />
    )
}

const ListHeader = (props) => {
    return(
        <View style={style.header}>
            <Text style={style.headerTitle}>{props.title}</Text>
            <View style={style.buttonContainer}>
                <PartyButton onPress={props.onPress}/>
            </View>
        </View>
    )
}

const PaymentCard = (props) => {
    const payment = props.payment;
    const currentUserId = props.currentUserId;

    const amountColor = payment.user._id == currentUserId ? APP_GREEN : APP_RED;
    const amountStyle = [style.amount, { color: amountColor }]

    return (
        <View style={[style.paymentCardContainer, listStyles.block]}>
            <Text style={amountStyle}>{payment.amount.toString()}</Text>
            <PMBDivider/>
            <View style={{flexDirection: 'column'}}>
                <PMBUser user={payment.user} />
                <Text style={style.description} numberOfLines={2} ellipsizeMode='tail'>
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
        <View>
            <ListHeader 
                title='Payments'
                onPress={props.onAdd}
            />
            <FlatList
                style={[listStyles.block, props.style]}
                data={props.payments}
                renderItem={renderPaymentItem}
                keyExtractor={payment => payment._id}
                horizontal
            />
        </View>
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
        borderRadius: 10
    },
    amount: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: '700',
        opacity: 0.9
    },
    description: {
        fontSize: 15,
        fontWeight: '400',
        opacity: 0.6,
        width: 110,
        alignSelf: 'center'
    },
    header: {
        flexDirection: 'row',
        marginBottom: -16,
        alignItems: 'center',
        opacity: 0.2,
        shadowRadius: 1,
        shadowOpacity: 0.9,
        shadowOffset: {height: 0, width: 0},
        marginLeft: 16,
    }, 
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
    }, 
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:  'flex-end',
    },
});

export { PartyPaymentsList, ListHeader };