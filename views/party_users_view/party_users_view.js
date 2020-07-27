import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { BodyContainer, ListContainer } from '../../components/component_containers';
import { AppStyles, APP_COLOR, APP_FONT } from '../../styles';
import AddUsersOverlay from './add_users_overlay';
import { UserContext } from '../../context/user_context';

const PartyUsersList = (props) => {
    const currentUser = React.useContext(UserContext);
    const party = props.route.params.party;

    const [users, setUsers] = useState([]);
    const [isAddUsersVisible, setAddUsersVisible] = useState(false);

    loadUsersAndDummies = () => {
        party.getUsersAndDummiesAsUsers()
            .then(setUsers)
            .catch(console.log);
    };

    useEffect(() => {
        loadUsersAndDummies();
    }, []);

    const renderUserItem = ({item}) => {
        return (
            <ListItem 
                title={item.name}
                titleStyle={AppStyles.listTitle}
                subtitle={item.email}
                leftAvatar={{
                    source: { url: item.photoUrl },
                    rounded: true
                }}
                subtitleStyle={AppStyles.listSubtitle}
                key={item._id}
            />
        )
    }

    return (
        <BodyContainer>
            <ListContainer>
                {users.map(user => {
                    return(renderUserItem({item: user}))
                })}
            </ListContainer>
            <Icon 
                containerStyle={AppStyles.floatingIconButton}
                name='add'
                color={APP_COLOR}
                onPress={() => setAddUsersVisible(true)}
                reverse
            />
            <AddUsersOverlay
                isVisible={isAddUsersVisible}
                partyUsers={users}
                updateUsers={loadUsersAndDummies}
                onClose={() => setAddUsersVisible(false)}
                party={party}
            />
        </BodyContainer>
    )
}

export default PartyUsersList;