import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { BodyContainer } from '../../components/component_containers';
import commonStyles, { APP_COLOR } from '../../styles';
import AddUsersOverlay from './add_users_overlay';

const PartyUsersList = (props) => {

    const [users, setUsers] = useState([]);
    const [isAddUsersVisible, setAddUsersVisible] = useState(false);

    const currentUser = props.route.params.user;
    const party = props.route.params.party;

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
                subtitle={item.email}
                leftAvatar={{
                    source: { url: item.photoUrl },
                    rounded: true
                }}
                subtitleStyle={{opacity: 0.5, fontSize: 13}}
                key={item._id}
            />
        )
    }

    return (
        <BodyContainer>
            <View style={commonStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden'}}>
                    {users.map(user => {
                        return(renderUserItem({item: user}))
                    })}
                </View>
            </View>
            <Icon 
                containerStyle={commonStyles.floatingIconButton}
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
                currentUser={currentUser}
            />
        </BodyContainer>
    )
}

export default PartyUsersList;