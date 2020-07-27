import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import PMBDivider from '../../components/pmb_divider';
import PMBOverlay from '../../components/pmb_overlay';
import { APP_COLOR, APP_FONT, APP_FONT_BOLD, APP_FONT_SEMIBOLD, APP_GREEN, APP_RED } from '../../styles';
import { UserContext } from '../../context/user_context';
import { ListContainer } from '../../components/component_containers';
import { ScrollView } from 'react-native-gesture-handler';

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
    const currentUser = React.useContext(UserContext);
    
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
                    source={{ url: props.user.photoUrl }}
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
                <Text style={[debtStyle.amount, {color: itemColor}]}>{debt.amount}</Text>
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
        maxHeight: 100,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        padding: 8,
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
        opacity: 0.5,
        textAlign: 'center'
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

    const party = props.party;

    const loadDebts = () => {
        party.getDebts()
            .then(debts => {
                setSum(debts.sum);
                setPerUser(debts.perPerson);
                setDebts(debts.debts);
            })
            .catch(console.log);
    }
    useEffect(() => {
        loadDebts()
    }, [props.isVisible])

    const renderDebtItem = (debt) => {
        return (
            <DebtItem 
                debt={debt} 
                key={debt.from._id + debt.to._id}
            />
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
            <View style={{marginBottom: 50}}>
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
                <ScrollView>
                    { debts.map(renderDebtItem) }
                </ScrollView>
            </View>
        </PMBOverlay>
    )
}

const style = StyleSheet.create({
    headerContainer: {
        height: 50,
        flexDirection: 'row',
        marginBottom: 8
    }
});

export default DebtsOverlay;