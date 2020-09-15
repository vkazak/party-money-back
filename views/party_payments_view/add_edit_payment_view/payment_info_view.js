import { observer } from 'mobx-react';
import React from 'react';
import { StoreContext } from '../../../context/store_context';
import { BodyContainer} from '../../../components/component_containers';
import { AppStyles, APP_BLUE, APP_COLOR, APP_FONT_SEMIBOLD, APP_GREEN } from '../../../styles';
import { Input, ListItem } from 'react-native-elements';
import { AddEditPaymentDialogs, AddEditPaymentViewStore } from '../../../store/view_store/party_payments_view_store/add_edit_payment_view.store';
import { AddMembersOverlay } from '../../party_members_view/add_members_overlay';
import { DataStatus } from '../../../store/pattern_store/async_data.store';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

@observer
export class PaymentInfoView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.viewStore = props.route.params.viewStore;
    }

    onSave() {
        this.context.partyReviewStore.paymentsStore.addPaymentToParty(
            this.viewStore.whoPay,
            this.viewStore.payFor,
            this.viewStore.amount,
            this.viewStore.description,
            this.viewStore
        ).finally(() => console.log('saved'));
    }

    render() {
        return(
            <>
                <Input
                    label='Amount of money'
                    onChangeText={ amount => this.viewStore.setAmount(Number(amount)) }
                    labelStyle={{ fontWeight: "500"}}
                    keyboardType='number-pad'
                    returnKeyType='done'
                />
                <Input
                    label='Payment desription'
                    placeholder='Description...'
                    onChangeText={ description => this.viewStore.setDescription(description) }
                    labelStyle={{ fontWeight: "500"}}
                />
                <Button 
                    title='Save'
                    onPress={() => this.onSave()}
                />
            </>
        )
    }
}

PaymentInfoView.contextType = StoreContext;