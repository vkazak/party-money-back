import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { BodyContainer } from '../components/component_containers';
import { AppStyles, APP_FONT } from '../styles';
import { User } from '../entities/user.entity';

const UsersListView = (props) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        User.getUsers()
            .then(setUsers)
            .catch(console.log)
    }, []);

    const renderUserItem = ({item}) => {

        const onPress = () => {
            props.navigation.navigate("Parties list", {user: item})
        };

        return(
            <ListItem 
                title={item.name}
                titleStyle={AppStyles.listTitle}
                subtitle={item.email}
                subtitleStyle={AppStyles.listSubtitle}
                leftAvatar={{
                    source: require('../src_files/default-avatar.png'),
                    rounded: true
                }}
                onPress={onPress}
                chevron
            />
        );
    }

    return(
        <BodyContainer>
            <View style={AppStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden'}}>
                    {users.map(user => {
                        return(renderUserItem({item: user}))
                    })}
                </View>
            </View>
        </BodyContainer>
    )
}

export default UsersListView;