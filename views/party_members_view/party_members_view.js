import { observer } from 'mobx-react';
import React from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { BodyContainer, ListContainer } from '../../components/component_containers';
import { StoreContext } from '../../context/store_context';
import { DataStatus } from '../../store/pattern_store/async_data.store';
import { PartyMembersViewDialogs, PartyMembersViewStore } from '../../store/view_store/party_members_view_store/party_members_view.store';
import { AppStyles, APP_COLOR } from '../../styles';
import { AddMembersOverlay } from '../../components/add_members_overlay';

@observer
export class PartyMembersView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.membersStore = context.partyReviewStore.membersStore;
        this.viewStore = new PartyMembersViewStore();
    }

    componentDidMount() {
        this.membersStore.fetchPartyMembersFromServer();
    }

    renderMemberItem(member) {
        return (
            <ListItem 
                title={member.name}
                titleStyle={AppStyles.listTitle}
                subtitle={member.email}
                leftAvatar={{
                    source: { url: member.photoUrl },
                    rounded: true
                }}
                subtitleStyle={AppStyles.listSubtitle}
                key={member._id}
            />
        )
    }

    render() {
        return (
            <BodyContainer>
                <ListContainer
                    isLoading={this.membersStore.dataStatus === DataStatus.LOADING} 
                    refreshing={this.membersStore.dataStatus === DataStatus.UPDATING} 
                    onRefresh={() => this.membersStore.forceFetchPartyMembersFromServer()}
                >
                    { this.membersStore.members.map(this.renderMemberItem) }
                </ListContainer>
                <Icon 
                    containerStyle={AppStyles.floatingIconButton}
                    name='add'
                    color={APP_COLOR}
                    onPress={() => this.viewStore.showAddMembersDialog()}
                    reverse
                />
                <AddMembersOverlay
                    title='Add members to party'
                    saveTitle='Add'
                    isVisible={this.viewStore.visibleDialog === PartyMembersViewDialogs.ADD_MEMBERS}
                    onClose={() => this.viewStore.closeDialog()}
                    onSave={this.membersStore.addMembersToParty.bind(this.membersStore)}
                    isLoading={this.context.dummiesStore.dataStatus === DataStatus.isLoading || 
                               this.context.partyReviewStore.membersStore.dataStatus === DataStatus.isLoading}
                    multiplePick={true}
                    store={this.context.partyReviewStore.membersStore}
                    getDataFromStore={(store) => store.membersOutOfParty}
                    loadData={() => this.context.dummiesStore.fetchMembersFromServer()}
                    closeDelayedAfterSave={true}
                />
            </BodyContainer>
        )
    }
}
PartyMembersView.contextType = StoreContext;