import { observer } from 'mobx-react';
import React from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { BodyContainer, ListContainer } from '../../components/component_containers';
import { StoreContext } from '../../context/store_context';
import { DataStatus } from '../../store/pattern_store/async_data.store';
import { DummiesViewStore, DummyViewDialogs } from '../../store/view_store/dummies_view_store/dummies_view.store';
import { AppStyles, APP_COLOR } from '../../styles';
import { AddDummyOverlay } from './add_dummy_overlay';

@observer
export class DummiesListView extends React.Component {
    constructor(props, context) {
        super(props);
        this.viewStore = new DummiesViewStore();
        this.dummiesStore = context.dummiesStore;
    }

    componentDidMount() {
        this.dummiesStore.fetchMembersFromServer();
    }

    renderDummyItem(dummy) {
        return(
            <ListItem 
                title={dummy.name}
                titleStyle={AppStyles.listTitle}
                leftAvatar={{
                    source: { url: dummy.photoUrl },
                    rounded: true
                }}
                key={dummy._id}
            />
        );
    };

    render() {
        return(
            <BodyContainer>
                <ListContainer 
                    isLoading={this.dummiesStore.dataStatus === DataStatus.LOADING} 
                    refreshing={this.dummiesStore.dataStatus === DataStatus.UPDATING} 
                    onRefresh={() => this.dummiesStore.forceFetchMembersFromServer()}
                >
                    { this.dummiesStore.dummies.map(this.renderDummyItem) }          
                </ListContainer>
                <Icon 
                    containerStyle={AppStyles.floatingIconButton}
                    name='add'
                    color={APP_COLOR}
                    onPress={() => this.viewStore.showAddDummyDialog()}
                    reverse
                />
                <AddDummyOverlay
                    isVisible={this.viewStore.visibleDialog === DummyViewDialogs.ADD_DUMMY}
                    onSave={this.dummiesStore.createDummy.bind(this.dummiesStore)}
                    onClose={() => this.viewStore.closeDialog()}
                />
            </BodyContainer>
        )
    }
}
DummiesListView.contextType = StoreContext;