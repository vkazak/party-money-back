import React, { useState } from 'react';
import { ListItem } from 'react-native-elements';
import { ListContainer } from '../../components/component_containers';
import PMBOverlay from '../../components/pmb_overlay';
import { StoreContext } from '../../context/store_context';
import { DataStatus } from '../../store/pattern_store/async_data.store';
import { AddPartyMembersOverlayStore } from '../../store/view_store/party_members_view_store/add_party_members_overlay.store';
import { AppStyles } from '../../styles';
import { closeDialogDelayed } from '../../utils';

const MemberAndCheckBoxItem = (props) => {
    const [checked, setChecked] = useState(false);
    const member = props.member;

    return(
        <ListItem 
            title={member.name}
            titleStyle={AppStyles.listTitle}
            subtitle={member.email}
            subtitleStyle={AppStyles.listSubtitle}
            leftAvatar={{
                source: { url: member.photoUrl },
                rounded: true
            }}
            checkBox={{
                checked: checked,
                onPress: () => {
                    props.toggleMember(member)
                    setChecked(!checked)
                }
            }}
        />
    );
}

export class AddMembersOverlay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.membersStore = context.partyReviewStore.membersStore;
        this.viewStore = new AddPartyMembersOverlayStore();
    }

    componentDidMount() {
        this.context.dummiesStore.fetchMembersFromServer();
    }

    componentDidUpdate() {
        if (!this.props.isVisible) this.viewStore.clearStore();
    }

    onSave() {
        this.membersStore.addMembersToParty(
            this.viewStore.checkedMembers,
            this.viewStore
        ).finally(() => closeDialogDelayed(this.props.onClose))
    }

    renderMemberItem(member) {
        return (
            <MemberAndCheckBoxItem
                member={member}
                toggleMember={this.viewStore.toggleMember.bind(this.viewStore)}
                key={member._id}
            />
        )
    }

    render() {
        return(
            <PMBOverlay
                title='Add members to the party'
                saveTitle='Add'
                isVisible={this.props.isVisible}
                onClose={this.props.onClose}
                onSave={this.onSave.bind(this)}
                asyncSaveStore={this.viewStore}
            >   
                <ListContainer 
                    isLoading={this.context.dummiesStore.dataStatus === DataStatus.LOADING} 
                    noBlock 
                    noFullScreen
                >
                    { this.membersStore.membersOutOfParty.map(this.renderMemberItem.bind(this)) }
                </ListContainer>
            </PMBOverlay>
        )
    }
}
AddMembersOverlay.contextType = StoreContext;