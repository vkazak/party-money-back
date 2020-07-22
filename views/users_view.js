import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { BodyContainer } from '../components/component_containers';
import commonStyles, { APP_FONT } from '../styles';
import makeFullUrl from '../utils';

const UsersListView = (props) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(makeFullUrl('/users'))
            .then(response => {
                setUsers(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    const renderUserItem = ({item}) => {

        const onPress = () => {
            props.navigation.navigate("Parties list", {user: item})
        };

        return(
            <ListItem 
                title={item.name}
                titleStyle={{fontFamily: APP_FONT}}
                subtitle={item.email}
                subtitleStyle={{fontSize: 14, opacity: 0.5, fontFamily: APP_FONT}}
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
            <View style={commonStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden',}}>
                    {users.map(user => {
                        return(renderUserItem({item: user}))
                    })}
                </View>
            </View>
        </BodyContainer>
    )
}

export default UsersListView;