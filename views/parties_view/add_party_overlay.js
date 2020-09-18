import { observer } from 'mobx-react';
import React from 'react';
import { Input } from 'react-native-elements';
import { PMBInput } from '../../components/pmb_input';
import PMBOverlay from '../../components/pmb_overlay';
import { AddPartyOverlayStore } from '../../store/view_store/parties_view_store/add_party_overlay.store';
import { closeDialogDelayed } from '../../utils';

@observer
export class AddPartyOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.viewStore = new AddPartyOverlayStore();
    }

    componentDidUpdate() {
        if (!this.props.isVisible) this.viewStore.clearStore();
    }

    onSave() {
        if (this.viewStore.checkPartyName()) {
            this.props.onSave(this.viewStore.partyName, this.viewStore)
                .finally(() => closeDialogDelayed(this.props.onClose))
        }
    }

    render() {
        return (
            <PMBOverlay
                title='Add a new party'
                saveTitle='Add'
                isVisible={this.props.isVisible}
                onClose={this.props.onClose}
                onSave={this.onSave.bind(this)}
                asyncSaveStore={this.viewStore}
            >
                <PMBInput
                    containerStyle={{marginVertical: 30}}
                    label='Party name'
                    placeholder='Scrinzh'
                    onChangeText={this.viewStore.setPartyName}
                    errorStyle={{ color: 'red' }}
                    errorMessage={this.viewStore.errorMessage}
                />
            </PMBOverlay>
        )
    }
}