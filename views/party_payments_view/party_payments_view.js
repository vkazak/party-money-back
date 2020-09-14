import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Icon } from 'react-native-elements';
import { BodyContainer, ListContainer } from '../../components/component_containers';
import PMBDivider from '../../components/pmb_divider';
import { StoreContext } from '../../context/store_context';
import { DataStatus } from '../../store/pattern_store/async_data.store';
import { PartyPaymentsViewDialogs, PartyPaymentsViewStore } from '../../store/view_store/party_payments_view_store/party_payments_view.store';
import { AppStyles, APP_COLOR, APP_FONT, APP_FONT_BOLD, APP_FONT_SEMIBOLD, APP_GREEN } from '../../styles';
import { AddPaymentOverlay } from './add_payment_overlay';
import { DebtsOverlay } from './debts_overlay';


const PaymentCard = (props) => {
    const payment = props.payment;
    const isCurrentUser = payment.member._id === useContext(StoreContext).userStore.user._id;

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
                            source={{ url: payment.member.photoUrl }}
                            size={40}
                            rounded
                        />
                        <Text style={[style.userName, {color: nameColor}]}>{payment.member.name}</Text>
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

@observer
export class PartyPaymentsView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.paymentsStore = context.partyReviewStore.paymentsStore;
        this.viewStore = new PartyPaymentsViewStore();
    }

    componentDidMount() {
        const fetchMembersAndPayments = async () => {
            await this.context.partyReviewStore.membersStore.fetchPartyMembersFromServer();
            this.paymentsStore.fetchPartyPaymentsFromServer();
        };
        fetchMembersAndPayments();
    }

    renderPaymentItem(payment) {
        return (
            <PaymentCard
                payment={payment}
                key={payment._id}
            />
        )
    }

    render() {
        return (
            <BodyContainer>
                <View style={style.debtButtonBox}>
                    <Button
                        title='Show summary'
                        titleStyle={style.debtButtonTitle}
                        buttonStyle={style.debtButton}
                        onPress={() => this.viewStore.showDebtsReviewDialog()}
                        raised
                    />
                </View>
                <ListContainer 
                    isLoading={this.paymentsStore.dataStatus === DataStatus.LOADING} 
                    refreshing={this.paymentsStore.dataStatus === DataStatus.UPDATING} 
                    onRefresh={() => this.paymentsStore.forceFetchPartyPaymentsFromServer()}
                    style={{marginTop: 60}}
                >
                    { this.paymentsStore.payments.map(this.renderPaymentItem.bind(this)) }
                </ListContainer>
                <Icon 
                    containerStyle={AppStyles.floatingIconButton}
                    name='add'
                    color={APP_COLOR}
                    onPress={() => this.viewStore.showAddPaymentDialog()}
                    reverse
                />
                <AddPaymentOverlay
                    isVisible={this.viewStore.visibleDialog === PartyPaymentsViewDialogs.ADD_PAYMENT}
                    onClose={() => this.viewStore.closeDialog()}
                />{
                <DebtsOverlay
                    isVisible={this.viewStore.visibleDialog === PartyPaymentsViewDialogs.DEBTS_REVIEW}
                    onClose={() => this.viewStore.closeDialog()}
                />}
            </BodyContainer>
        )
    }
}
PartyPaymentsView.contextType = StoreContext;

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