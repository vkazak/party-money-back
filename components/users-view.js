import React, { useState, useEffect } from 'react';
import {FlatList} from 'react-native';
import axios from 'axios';
import makeFullUrl from '../utils';
import { ListItem } from 'react-native-elements';
import commonStyles from './common-styles';

const UserList = (props) => {

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
                subtitle={item.email}
                leftAvatar={{
                    source: require('../src-files/default-avatar.png'),
                    rounded: true
                }}
                onPress={onPress}
                chevron
            />
        );
    }

    return(
        <FlatList
            style={commonStyles.block}
            data={users}
            renderItem={renderUserItem}
            keyExtractor={user => user._id}
        />
    )
}

export default UserList;