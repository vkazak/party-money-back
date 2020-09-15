import { observer } from 'mobx-react';
import React from 'react';
import { StoreContext } from '../../../context/store_context';
import { BodyContainer} from '../../../components/component_containers';
import { AppStyles, APP_BLUE, APP_COLOR, APP_FONT_SEMIBOLD, APP_GREEN } from '../../../styles';
import { ListItem } from 'react-native-elements';
import { AddEditPaymentDialogs, AddEditPaymentViewStore } from '../../../store/view_store/party_payments_view_store/add_edit_payment_view.store';
import { AddMembersOverlay } from '../../party_members_view/add_members_overlay';
import { DataStatus } from '../../../store/pattern_store/async_data.store';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

@observer
class WhoPay extends React.Component {
    render() {
        return(
            <>
                <Text>Who pay?</Text> 
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
        shadowRadius: 6,
        elevation: 4
    },
    touchable: {
        borderRadius: 16,
        backgroundColor: APP_COLOR + 10,
    },
    name: {
        fontFamily: APP_FONT_SEMIBOLD,
        fontSize: 18,
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
class PayFor extends React.Component {
    render() {
        return(
            <>
                <Text>Pay for {this.props.viewStore.payFor.lenght} members</Text>
                <ScrollView>
                    { this.props.viewStore.payFor.map(member => 
                        <ItemPayFor member={member} onPress={() => this.props.viewStore.showPayForDialog()}/>
                    ) }
                </ScrollView>
            </>
        )
    }
}

@observer
export class PaymentMembersView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.viewStore = new AddEditPaymentViewStore(context.userStore.user);
        this.viewStore.setPayFor(context.partyReviewStore.membersStore.members)
    }
    
    render() {
        return(
            <BodyContainer>
                <View style={Style.container}>
                    <WhoPay viewStore={this.viewStore}/>
                    <PayFor viewStore={this.viewStore}/>
                    <Button 
                        title={'Move next'}
                        onPress={() => this.props.navigation.navigate("Payment info", {viewStore: this.viewStore})}
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
                </View>
            </BodyContainer>
        )
    }
}

PaymentMembersView.contextType = StoreContext;

const Style = StyleSheet.create({
    container: {
        marginHorizontal: 24,
        marginVertical: 10
    }
});