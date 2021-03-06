import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { AddMembersOverlay } from '../../components/add_members_overlay';
import { BodyContainer } from '../../components/component_containers';
import { FullWidthButton } from '../../components/full_width_button';
import { MessyMembersList } from '../../components/messy_members_list';
import { StoreContext } from '../../context/store_context';
import { DataStatus } from '../../store/pattern_store/async_data.store';
import { AddEditPaymentDialogs, AddEditPaymentViewStore } from '../../store/view_store/party_payments_view_store/add_edit_payment_view.store';
import { APP_COLOR, APP_FONT_SEMIBOLD, APP_GREEN } from '../../styles';

@observer
class WhoPay extends React.Component {
    render() {
        return(
            <>
                <ListItem
                    title={this.props.viewStore.whoPay.name}
                    titleStyle={WhoPayStyle.name}
                    style={WhoPayStyle.touchable}
                    containerStyle={WhoPayStyle.container}
                    leftAvatar={{
                        source: { url: this.props.viewStore.whoPay.photoUrl },
                        rounded: true
                    }}
                    onPress={() => this.props.viewStore.showWhoPayDialog()}
                />
            </>
        )
    }
}

const WhoPayStyle = StyleSheet.create({
    container: {
        borderRadius: 16,
        shadowColor: APP_GREEN,
        shadowOffset: {width: 1,  height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
        borderColor: APP_GREEN + '40',
        borderWidth: 1,
    },
    touchable: {
        borderRadius: 16,
        backgroundColor: APP_COLOR + 10,
    },
    name: {
        fontFamily: APP_FONT_SEMIBOLD,
        fontSize: 15,
        opacity: 0.6,
        marginLeft: 8,
    }
});

function ItemPayFor(props) {
    
    return(
        <ListItem
            title={props.member.name}
            leftAvatar={{
                source: { url: props.member.photoUrl },
                rounded: true
            }}
            onPress={props.onPress}
        />
    )
}

@observer
export class PaymentMembersView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.viewStore = new AddEditPaymentViewStore(context.userStore.user);
        this.viewStore.setPayFor(context.partyReviewStore.membersStore.members)
    }

    @computed 
    get countPayForMembers() {
        if (this.viewStore.payFor.length === this.context.partyReviewStore.membersStore.members.length)
            return 'All'
        else
            return this.viewStore.payFor.length
    }
    
    render() {
        return(
            <>
                <BodyContainer>
                    <ScrollView contentContainerStyle={Style.container}>
                        <Text style={Style.title}>Who pay?</Text> 
                        <WhoPay viewStore={this.viewStore}/>
                        <Text style={Style.title}>{`Pay for: ${this.countPayForMembers} members`}</Text> 
                        <MessyMembersList 
                            members={this.viewStore.payFor} 
                            onEdit={() => this.viewStore.showPayForDialog()}
                        />
                        <AddMembersOverlay
                            title='Who pay?'
                            saveTitle='Ok'
                            isVisible={this.viewStore.visibleDialog === AddEditPaymentDialogs.WHO_PAY}
                            onClose={() => this.viewStore.closeDialog()}
                            onSave={this.viewStore.setWhoPay.bind(this.viewStore)}
                            isLoading={this.context.partyReviewStore.membersStore.dataStatus === DataStatus.isLoading}
                            multiplePick={false}
                            store={this.context.partyReviewStore.membersStore}
                            getDataFromStore={(store) => store.members}
                        />
                        <AddMembersOverlay
                            title='Pay for'
                            saveTitle='Ok'
                            isVisible={this.viewStore.visibleDialog === AddEditPaymentDialogs.PAY_FOR}
                            onClose={() => this.viewStore.closeDialog()}
                            onSave={this.viewStore.setPayFor.bind(this.viewStore)}
                            isLoading={this.context.partyReviewStore.membersStore.dataStatus === DataStatus.isLoading}
                            multiplePick={true}
                            store={this.context.partyReviewStore.membersStore}
                            getDataFromStore={(store) => store.members}
                            initSelectedMembers={this.viewStore.payFor}
                        />
                    </ScrollView>
                </BodyContainer>
                <FullWidthButton
                    title={'Move next'}
                    onPress={() => this.props.navigation.navigate("Payment info", {viewStore: this.viewStore})}
                    containerStyle={Style.moveNextButtonContainer}
                    disabled={this.countPayForMembers === 0}
                />
            </>
        )
    }
}

PaymentMembersView.contextType = StoreContext;

const Style = StyleSheet.create({
    container: {
        marginHorizontal: 24,
        paddingBottom: 72,
    },
    title: {
        fontFamily: APP_FONT_SEMIBOLD,
        fontSize: 14,
        opacity: 0.6,
        margin: 8,
    },
    moveNextButtonContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0,
        marginVertical: 8,
        width: '85%'
    }
});