import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import PMBDivider from '../../components/pmb_divider';
import PMBOverlay from '../../components/pmb_overlay';
import { APP_COLOR, APP_FONT, APP_FONT_BOLD, APP_FONT_SEMIBOLD, APP_GREEN, APP_RED } from '../../styles';
import makeFullUrl from '../../utils';

const AmountInfo = (props) => {
    return (
        <View style={amountInfoStyle.container}>
            <Text style={amountInfoStyle.title}>{props.title}</Text>
            <Text style={amountInfoStyle.amount}>{props.amount}</Text>
        </View>
    )
}

const amountInfoStyle = StyleSheet.create({
    container: {
        width: '50%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 15,
        fontFamily: APP_FONT,
        opacity: 0.4
    },
    amount: {
        color: APP_COLOR,
        fontFamily: APP_FONT_BOLD,
        fontSize: 30
    }
});

const DebtItem = (props) => {
    const debt = props.debt;
    const currentUser = props.currentUser;
    
    const opacity = '30';
    let itemColor = APP_COLOR;
    if (debt.from._id == currentUser._id){
        itemColor = APP_RED;
    }
    else if (debt.to._id == currentUser._id) {
        itemColor = APP_GREEN;
    }
    const backgroundColor = itemColor + opacity;

    const UserBlock = (props) => {

        return (
            <View style={debtStyle.usersBlock}>
                <Avatar 
                    source={require('../../src_files/default-avatar.png')}
                    size={35}
                    rounded
                />
                <Text style={debtStyle.userName}>{props.user.name}</Text>
            </View>
        )
    }

    return (
        <View style={[debtStyle.container, {backgroundColor: backgroundColor}]}>
            <UserBlock user={debt.from} />
            <View style={debtStyle.amountBlock}>
                <Text style={[debtStyle.amount, {color: itemColor}]}>{debt.amount.toFixed(1)}</Text>
                <Icon 
                    name='md-arrow-forward'
                    type='ionicon'
                    color={itemColor}
                />
            </View>
            <UserBlock user={debt.to} />
        </View>
    )
}

const debtStyle = StyleSheet.create({
    container: {
        minHeight: 80,
        maxHeight: 80,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 15,
    },
    usersBlock: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontFamily: APP_FONT_SEMIBOLD,
        fontSize: 14,
        opacity: 0.5
    },
    amountBlock: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    amount: {
        opacity: 0.9,
        fontSize: 20,
        fontFamily: APP_FONT_BOLD
    }
});

const DebtsOverlay = (props) => {
     
    const [sum, setSum] = useState(0);
    const [perUser, setPerUser] = useState(0);
    const [debts, setDebts] = useState([]);

    const populateDebt = (debt) => {
        return ({
            from: props.users.find(user => user._id == debt.from),
            to: props.users.find(user => user._id == debt.to),
            amount: debt.amount
        })
    }
    
    useEffect(() => {
        if (props.users.length > 0 && props.payments.length > 0) {
            axios.get(makeFullUrl(`/calculate/debts/${props.partyId}`))
                .then(response => {
                    setSum(Number(response.data.spent).toFixed(1));
                    setPerUser(Number(response.data.perPerson).toFixed(1));
                    setDebts(response.data.debts.map(populateDebt));
                })
                .catch(err => console.log(err));
        }
    }, [props.users, props.payments])

    const renderDebtItem = ({item}) => {
        return (
            <View>
                <DebtItem debt={item} currentUser={props.currentUser} />
            </View>
        )
    }

    return (
        <PMBOverlay
            title='Debts report'
            saveTitle='OK'
            isVisible={props.isVisible}
            onClose={props.onClose}
            onSave={props.onClose}
        >
            <View style={{marginBottom: 10}}>
                <View style={style.headerContainer}>
                    <AmountInfo 
                        title='Per person'
                        amount={perUser}
                    />
                    <PMBDivider/>
                    <AmountInfo
                        title='Total spent'
                        amount={sum}
                    />
                </View>
                <View>
                    <FlatList
                        style={{margin: 5}}
                        data={debts}
                        renderItem={renderDebtItem}
                        keyExtractor={debt => {debt.from, debt.to}}
                    />
                </View>
            </View>
        </PMBOverlay>
    )
}

const style = StyleSheet.create({
    headerContainer: {
        height: 50,
        flexDirection: 'row'
    }
});

export default DebtsOverlay;