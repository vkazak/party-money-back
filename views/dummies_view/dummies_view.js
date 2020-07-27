import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { BodyContainer, ListContainer } from '../../components/component_containers';
import { AppStyles, APP_COLOR } from '../../styles';
import { UserContext } from '../../context/user_context';
import AddDummyOverlay from './add_dummy_overlay';

const DummiesListView = (props) => {
    const currentUser = React.useContext(UserContext);

    const [dummies, setDummies] = useState([]);
    const [isAddDialogVisible, setAddDialogVisible] = useState(false);

    const loadDummiesAsUsers = () => {
        currentUser.getDummiesAsUsers()
            .then(setDummies)
            .catch(console.log)
    };

    useEffect(() => {
        loadDummiesAsUsers();
    }, []);

    const renderDummyItem = (dummy) => {
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

    return(
        <BodyContainer>
            <ListContainer>
                { dummies.map(renderDummyItem) }          
            </ListContainer>
            <Icon 
                containerStyle={AppStyles.floatingIconButton}
                name='add'
                color={APP_COLOR}
                onPress={() => setAddDialogVisible(true)}
                reverse
            />
            <AddDummyOverlay
                isVisible={isAddDialogVisible}
                onClose={() => setAddDialogVisible(false)}
                updateDummies={loadDummiesAsUsers}
            />
        </BodyContainer>
    )
}

export default DummiesListView;