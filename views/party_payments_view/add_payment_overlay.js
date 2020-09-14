import { Picker } from '@react-native-community/picker';
import { observer } from 'mobx-react';
import React from 'react';
import { Input } from 'react-native-elements';
import { LoadIndicatorView } from '../../components/component_containers';
import PMBOverlay from '../../components/pmb_overlay';
import { StoreContext } from '../../context/store_context';
import { DataStatus } from '../../store/pattern_store/async_data.store';
import { AddPaymentOverlayStore } from '../../store/view_store/party_payments_view_store/add_payment_overlay.store';
import { closeDialogDelayed } from '../../utils';

@observer
export class AddPaymentOverlay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.currentUserId = context.userStore.user._id;
        this.paymentsStore = context.partyReviewStore.paymentsStore;
        this.partyMembersStore = context.partyReviewStore.membersStore;
        this.viewStore = new AddPaymentOverlayStore(this.currentUserId);
    }

    componentDidMount() {
        this.partyMembersStore.fetchPartyMembersFromServer();
    }

    componentDidUpdate() {
        if (!this.props.isVisible) this.viewStore.clearStore();
    }

    onSave() {
        this.paymentsStore.addPaymentToParty(
            this.viewStore.pickedMemberId,
            this.viewStore.amount,
            this.viewStore.description,
            this.viewStore
        ).finally(() => closeDialogDelayed(this.props.onClose));
    }

    render() {
        return(
            <PMBOverlay
                title='Add new payment'
                saveTitle='Add'
                isVisible={this.props.isVisible}
                onClose={this.props.onClose}
                onSave={this.onSave.bind(this)}
                asyncSaveStore={this.viewStore}
            >
                <LoadIndicatorView 
                    isLoading={this.partyMembersStore.dataStatus === DataStatus.LOADING}
                >
                    <Picker 
                        mode='dropdown'
                        selectedValue={ this.viewStore.selectedMemberId }
                        onValueChange={ (memberId) => this.viewStore.setPickedMemberId(memberId) }
                    >
                        {
                            this.partyMembersStore.members.map(member => 
                                <Picker.Item label={member.name} value={member._id} key={member._id}/>
                            )
                        }
                    </Picker>
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
                </LoadIndicatorView>
            </PMBOverlay>
        )
    }
}

AddPaymentOverlay.contextType = StoreContext;