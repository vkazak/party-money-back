import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { BodyContainer } from '../../components/component_containers';
import commonStyles, { APP_COLOR } from '../../styles';
import { makeFullUrl, avatarUrl } from '../../utils';
import AddUsersOverlay from './add_users_overlay';

const PartyUsersList = (props) => {

    const [users, setUsers] = useState([]);
    const [dummies, setDummies] = useState([]);
    const [isAddUsersVisible, setAddUsersVisible] = useState(false);

    const currentUser = props.route.params.user;
    const party = props.route.params.party;

    useEffect(() => {
        axios.get(makeFullUrl(`/users/by_party/${party._id}`))
            .then(response => {
                setUsers(response.data);
            })
            .catch(err => console.log(err));
        axios.get(makeFullUrl(`/dummies/by_party/${party._id}`))
            .then(response => {
                console.log(response.data);
                setDummies(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    const addUsersToList = (newUsers) => {
        setUsers(users.slice().concat(newUsers))
    }
    const addDummiesToList = (newDummies) => {
        setDummies(dummies.slice().concat(newDummies))
    }

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
            />
        )
    }
    const renderDummyItem = ({item}) => {
        return (
            <ListItem 
                title={item.name}
                leftAvatar={{
                    source: { url: avatarUrl },
                    rounded: true
                }}
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
                    {dummies.map(dummy => {
                        return(renderDummyItem({item: dummy}))
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
                partyDummies={dummies}
                addUsersToList={addUsersToList}
                addDummiesToList={addDummiesToList}
                onClose={() => setAddUsersVisible(false)}
                partyId={party._id}
                currentUserId={currentUser._id}
            />
        </BodyContainer>
    )
}

export default PartyUsersList;