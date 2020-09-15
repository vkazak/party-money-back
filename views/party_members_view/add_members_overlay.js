import { autorun, computed } from 'mobx';
import { observer } from 'mobx-react';
import { PropTypes } from 'prop-types';
import React, { useState } from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { ListContainer } from '../../components/component_containers';
import PMBOverlay from '../../components/pmb_overlay';
import { StoreContext } from '../../context/store_context';
import { AddPartyMembersOverlayStore } from '../../store/view_store/party_members_view_store/add_party_members_overlay.store';
import { AppStyles, APP_COLOR } from '../../styles';
import { closeDialogDelayed } from '../../utils';

@observer
class MemberAndCheckBoxItem extends React.Component {
    constructor(props) {
        super(props);

        this.iconName = props.viewStore.multiplePick ? 'ios-checkmark-circle' : 'ios-radio-button-on';
    }

    @computed
    get checked() {
        if (this.props.viewStore.multiplePick) {
            return this.props.viewStore.selected.some(member => member._id === this.props.member._id)
        } else {
            return this.props.viewStore.selected._id === this.props.member._id
        }
    }

    render() {
        return(
            <ListItem 
                title={this.props.member.name}
                titleStyle={AppStyles.listTitle}
                subtitle={this.props.member.email}
                subtitleStyle={AppStyles.listSubtitle}
                leftAvatar={{
                    source: { url: this.props.member.photoUrl },
                    rounded: true
                }}
                rightElement={
                    this.checked && <Icon
                        name={this.iconName}
                        type='ionicon'
                        color={APP_COLOR}
                    />
                }
                onPress={() => this.props.viewStore.toggleMember(this.props.member)}
            />
        );
    }
}

@observer
export class AddMembersOverlay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.viewStore = new AddPartyMembersOverlayStore(
            props.multiplePick, 
            context.userStore.user,
            props.initSelectedMembers
        );
    }

    componentDidMount() {
        this.props.loadData?.call(null);
    }

    componentDidUpdate() {
        if (!this.props.isVisible) this.viewStore.clearStore();
    }

    async onSave() {
        await this.props.onSave(this.viewStore.selected, this.viewStore);
        if (this.props.closeDelayedAfterSave)
            closeDialogDelayed(this.props.onClose);
        else {
            this.props.onClose()
        }
    }

    renderMemberItem(member) {
        return (
            <MemberAndCheckBoxItem
                member={member}
                viewStore={this.viewStore}
                key={member._id}
            />
        )
    }

    render() {
        return(
            <PMBOverlay
                title={this.props.title}
                saveTitle={this.props.saveTitle}
                isVisible={this.props.isVisible}
                onClose={this.props.onClose}
                onSave={this.onSave.bind(this)}
                asyncSaveStore={this.viewStore}
            >   
                <ListContainer 
                    isLoading={this.props.isLoading} 
                    noBlock 
                    noFullScreen
                >
                    { this.props.getDataFromStore(this.props.store).map(this.renderMemberItem.bind(this)) }
                </ListContainer>
            </PMBOverlay>
        )
    }
}

AddMembersOverlay.contextType = StoreContext;
AddMembersOverlay.propTypes = {
    title: PropTypes.string.isRequired,
    saveTitle: PropTypes.string,
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    multiplePick: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    getDataFromStore: PropTypes.func.isRequired,
    loadData: PropTypes.func,
    closeDelayedAfterSave: PropTypes.bool
}