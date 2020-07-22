import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { BodyContainer } from '../../components/component_containers';
import commonStyles, { APP_COLOR } from '../../styles';
import makeFullUrl from '../../utils';
import AddUsersOverlay from './add_users_overlay';

const PartyUsersList = (props) => {

    const [users, setUsers] = useState([]);
    const [isAddUsersVisible, setAddUsersVisible] = useState(false);

    const currentUser = props.route.params.user;
    const party = props.route.params.party;

    useEffect(() => {
        axios.get(makeFullUrl(`/users/by_party/${party._id}`))
            .then(response => {
                setUsers(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    const addUsersToList = (newUsers) => {
        setUsers(users.slice().concat(newUsers))
    }

    const renderUserItem = ({item}) => {
        return (
            <ListItem 
                title={item.name}
                subtitle={item.email}
                leftAvatar={{
                    source: require('../../src_files/default-avatar.png'),
                    rounded: true
                }}
                subtitleStyle={{opacity: 0.5, fontSize: 13}}
            />
        )
    }

    return (
        <BodyContainer>
            <View style={commonStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden',}}>
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
                addUsersToList={addUsersToList}
                onClose={() => setAddUsersVisible(false)}
                partyId={party._id}
            />
        </BodyContainer>
    )
}

export default PartyUsersList;