import { observer } from 'mobx-react';
import React from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { BodyContainer, ListContainer } from '../../components/component_containers';
import { StoreContext } from '../../context/store_context';
import { DataStatus } from '../../store/pattern_store/async_data.store';
import { PartyViewDialogs, PartiesViewStore } from '../../store/view_store/parties_view_store/parties_view.store';
import { AppStyles, APP_COLOR } from '../../styles';
import { AddPartyOverlay } from './add_party_overlay';

@observer
export class PartiesListView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.partiesStore = this.context.partiesStore;
        this.viewStore = new PartiesViewStore();
    }

    componentDidMount() {
        this.partiesStore.fetchPartiesFromServer();
    }

    renderPartyItem(party) {
        const onPress = () => {
            this.context.setCurrentPartyId(party._id);
            this.props.navigation.navigate("Party review");
        };
        return(
            <ListItem 
                title={party.name}
                titleStyle={AppStyles.listTitle}
                subtitle={`${party.numberOfMembers} member${party.numberOfMembers == 1 ? '' : 's'}`}
                subtitleStyle={AppStyles.listSubtitle}
                onPress={onPress}
                leftIcon={{
                    name: 'ios-beer',
                    type: 'ionicon',
                    color: APP_COLOR,
                    size: 35
                }}
                chevron={{color: APP_COLOR}}
                key={party._id}
            />
        )
    }
    
    render() {
        return(
            <BodyContainer>
                <ListContainer 
                    isLoading={this.partiesStore.dataStatus === DataStatus.LOADING} 
                    refreshing={this.partiesStore.dataStatus === DataStatus.UPDATING} 
                    onRefresh={() => this.partiesStore.forceFetchPartiesFromServer()}>
                    { this.partiesStore.parties.map(party => this.renderPartyItem(party)) }
                </ListContainer>
                <Icon 
                    containerStyle={AppStyles.floatingIconButton}
                    name='add'
                    color={APP_COLOR}
                    onPress={() => this.viewStore.showAddPartyDialog()}
                    reverse
                />
                <AddPartyOverlay
                    isVisible={this.viewStore.visibleDialog === PartyViewDialogs.ADD_PARTY}
                    onSave={this.partiesStore.createParty.bind(this.partiesStore)}
                    onClose={() => this.viewStore.closeDialog()}
                />
            </BodyContainer>
        )
    }
}

PartiesListView.contextType = StoreContext;