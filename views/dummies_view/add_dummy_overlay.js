import { observer } from 'mobx-react';
import React from 'react';
import { Input } from 'react-native-elements';
import PMBOverlay from '../../components/pmb_overlay';
import { AddDummyOverlayStore } from '../../store/view_store/dummies_view_store/add_dummy_overlay.store';
import { closeDialogDelayed } from '../../utils';

@observer
export class AddDummyOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.viewStore = new AddDummyOverlayStore();
    }

    componentDidUpdate() {
        if (!this.props.isVisible) this.viewStore.clearStore();
    }

    onSave() {
        if (this.viewStore.checkDummyName()) {
            this.props.onSave(this.viewStore.dummyName, this.viewStore)
                .finally(() => closeDialogDelayed(this.props.onClose))
        }
    }

    render() {
        return (
            <PMBOverlay
                title='Add a new dummy'
                saveTitle='Add'
                isVisible={this.props.isVisible}
                onClose={this.props.onClose}
                onSave={this.onSave.bind(this)}
                asyncSaveStore={this.viewStore}
            >
                <Input
                    containerStyle={{marginVertical: 30}}
                    label='Dummy user name'
                    placeholder='Vovan'
                    onChangeText={this.viewStore.setDummyName}
                    labelStyle={{ fontWeight: "500"}}
                    errorStyle={{ color: 'red' }}
                    errorMessage={this.viewStore.errorMessage}
                />
            </PMBOverlay>
        )
    }
}