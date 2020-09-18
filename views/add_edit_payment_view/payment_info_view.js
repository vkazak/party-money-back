import { observer } from 'mobx-react';
import React from 'react';
import { StoreContext } from '../../context/store_context';
import { BodyContainer} from '../../components/component_containers';
import { AppStyles, APP_BLUE, APP_COLOR, APP_FONT_BOLD, APP_FONT_SEMIBOLD, APP_GREEN, APP_RED } from '../../styles';
import { Input, ListItem } from 'react-native-elements';
import { AddEditPaymentDialogs, AddEditPaymentViewStore } from '../../store/view_store/party_payments_view_store/add_edit_payment_view.store';
import { AddMembersOverlay } from '../../components/add_members_overlay';
import { DataStatus } from '../../store/pattern_store/async_data.store';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PMBInput } from '../../components/pmb_input';
import { FullWidthButton } from '../../components/full_width_button';
import { Button } from 'react-native-elements';
import { IndicatorScreen} from '../../components/pmb_overlay';
import { closeDialogDelayed } from '../../utils';

function IncrementButton(props) {
    const IncrementButtonStyle = StyleSheet.create({
        container: {
            backgroundColor: props.color + '20',
            borderColor: props.color + '40',
            borderRadius: 16,
            borderWidth: 2,
            height: 60,
            width: 60
        },
        title: {
            fontFamily: APP_FONT_SEMIBOLD,
            color: props.color,
        }
    });

    return(
        <Button
            buttonStyle={IncrementButtonStyle.container}
            titleStyle={IncrementButtonStyle.title}
            {...props}
        />
    )
}

@observer
class AmountItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={AmountItemStyle.container}>
                <IncrementButton 
                    title='-5'
                    color={APP_RED}
                    onPress={() => this.props.viewStore.subAmount()}
                />
                <Input 
                    containerStyle={AmountItemStyle.inputContainer}
                    inputContainerStyle={AmountItemStyle.inputInputContainer}
                    inputStyle={AmountItemStyle.input}
                    onChangeText={ amount => this.props.viewStore.setAmount(Number(amount)) }
                    value={this.props.viewStore.amount.toString()}
                    keyboardType='number-pad'
                    returnKeyType='done'
                />
                <IncrementButton 
                    title='+5'
                    color={APP_GREEN}
                    onPress={() => this.props.viewStore.addAmount()}
                />
            </View>
        )
    }
}

const AmountItemStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 8
    },
    inputContainer: {
        width: 100,
        height: 60
    },
    inputInputContainer: {
        borderColor: '#00000040',
        paddingTop: 6,
    },  
    input: {
        fontFamily: APP_FONT_BOLD,
        color: APP_COLOR,
        opacity: 0.7,
        fontSize: 30,
        textAlign: 'center',
    }
});

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
        ).finally(() => closeDialogDelayed(
            () => this.props.navigation.navigate({ key: 'party_payments' })
        ));
    }

    render() {
        return(
            <BodyContainer>
                <View style={Style.container}>
                    <Text style={Style.title}>How much did you pay? </Text>
                    <AmountItem viewStore={this.viewStore} />
                    <PMBInput
                        label='Payment desription'
                        placeholder='Description...'
                        onChangeText={ description => this.viewStore.setDescription(description) }
                    />
                    <FullWidthButton 
                        title='Save payment'
                        onPress={() => this.onSave()}
                    />
                    <IndicatorScreen asyncSaveStore={this.viewStore}/> 
                </View>
            </BodyContainer>
        )
    }
}

PaymentInfoView.contextType = StoreContext;

const Style = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        flex: 1
    },
    title: {
        fontFamily: APP_FONT_SEMIBOLD,
        fontSize: 14,
        opacity: 0.6,
        alignSelf: 'center',
        margin: 8,
    },
});