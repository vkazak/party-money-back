import axios from 'axios';
import React, { useEffect, useState} from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import PMBOverlay from '../../components/pmb_overlay';
import makeFullUrl from '../../utils';
import listStyles, { APP_GREEN } from '../../styles';
import PMBDivider from '../../components/pmb_divider';
import PMBUser from '../../components/pmb_user';

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
        fontWeight: '300',
        opacity: 0.5
    },
    amount: {
        color: APP_GREEN,
        fontSize: 30,
        fontWeight: '700'
    }
});

const DebtItem = (props) => {
    const debt = props.debt;

    return (
        <View style={debtStyle.container}>
            <View style={debtStyle.usersBlock}>
                <PMBUser user={debt.from} />
                <PMBUser user={debt.to} />
            </View>
            
            <View style={debtStyle.amountBlock}>
                <Text style={debtStyle.amount}>{debt.amount}</Text>
            </View>
        </View>
    )
}

const debtStyle = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 60,
        flex: 1,
        flexDirection: 'row'
    },
    usersBlock: {
        flex: 0.8,
        flexDirection: 'column'
    },
    amountBlock: {
        flex: 0.2,
        justifyContent: 'center',
        marginRight: 16
    },
    amount: {
        color: APP_GREEN,
        fontSize: 25,
        fontWeight: '700'
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
                    setSum(Number(response.data.spent));
                    setPerUser(Number(response.data.perPerson));
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

    const makeSeparator = () => {
        return {
            
        }
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
                <FlatList
                    data={debts}
                    renderItem={renderDebtItem}
                    keyExtractor={debt => {debt.from, debt.to}}
                    ItemSeparatorComponent={ () => <PMBDivider style={{width: '60%'}} horizontal /> }

                />
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