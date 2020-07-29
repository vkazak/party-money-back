import React, { useEffect, useState } from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { BodyContainer, ListContainer } from '../../components/component_containers';
import { AppStyles, APP_COLOR } from '../../styles';
import AddUsersOverlay from './add_users_overlay';

const PartyUsersList = (props) => {
    const party = props.route.params.party;

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [isAddUsersVisible, setAddUsersVisible] = useState(false);

    const onDataLoaded = (users) => {
        setUsers(users);
        setLoading(false);
    }

    loadUsersAndDummies = () => {
        party.getUsersAndDummiesAsUsers()
            .then(onDataLoaded)
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
            <ListContainer isLoading={loading}>
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