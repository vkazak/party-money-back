import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import PMBDivider from '../../components/pmb_divider';
import PMBOverlay from '../../components/pmb_overlay';
import { StoreContext } from '../../context/store_context';
import { APP_COLOR, APP_FONT, APP_FONT_BOLD, APP_FONT_SEMIBOLD, APP_GREEN, APP_RED } from '../../styles';

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
    const currentUserId = React.useContext(StoreContext).userStore.user._id;
    
    const opacity = '30';
    let itemColor = APP_COLOR;
    if (debt.fromMember._id == currentUserId){
        itemColor = APP_RED;
    }
    else if (debt.toMember._id == currentUserId) {
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
            <UserBlock user={debt.fromMember} />
            <View style={debtStyle.amountBlock}>
                <Text style={[debtStyle.amount, {color: itemColor}]}>{debt.amount.toFixed(1)}</Text>
                <Icon 
                    name='md-arrow-forward'
                    type='ionicon'
                    color={itemColor}
                />
            </View>
            <UserBlock user={debt.toMember} />
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

@observer
export class DebtsOverlay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.paymentsStore = context.partyReviewStore.paymentsStore;
    }

    renderDebtItem(debt) {
        return (
            <DebtItem 
                debt={debt} 
                key={debt.fromMember._id + debt.toMember._id}
            />
        )
    }

    render() {
        return (
            <PMBOverlay
                title='Debts report'
                saveTitle='OK'
                isVisible={this.props.isVisible}
                onClose={this.props.onClose}
                onSave={this.props.onClose}
            >
                <View style={{marginBottom: 50}}>
                    <View style={style.headerContainer}>
                        <AmountInfo 
                            title='Per person'
                            amount={this.paymentsStore.debtsReport.maxPerPerson.toFixed(1)}
                        />
                        <PMBDivider/>
                        <AmountInfo
                            title='Total spent'
                            amount={this.paymentsStore.debtsReport.summaryAmount.toFixed(1)}
                        />
                    </View>
                    <ScrollView>
                        { this.paymentsStore.debtsReport.debts.map(this.renderDebtItem) }
                    </ScrollView>
                </View>
            </PMBOverlay>
        )
    }
}

DebtsOverlay.contextType = StoreContext;

const style = StyleSheet.create({
    headerContainer: {
        height: 50,
        flexDirection: 'row',
        marginBottom: 8
    }
});