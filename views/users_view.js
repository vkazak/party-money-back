import React, { useState, useEffect } from 'react';
import {FlatList, View} from 'react-native';
import axios from 'axios';
import makeFullUrl from '../utils';
import { ListItem } from 'react-native-elements';
import commonStyles, { APP_COLOR } from '../styles';

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
                subtitle={item.email}
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
        <View style={{backgroundColor: APP_COLOR, flex: 1}}>
            <View style={commonStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden',}}>
                    {users.map(user => {
                        return(renderUserItem({item: user}))
                    })}
                </View>
            </View>
            
        </View>
    )
}
/*<FlatList
                style={[commonStyles.block, {backgroundColor:'white', width: '90%', borderRadius:10, margin:10, marginBottom:10, paddingTop:10, paddingBottom:10, paddingLeft:10, position:'absolute', zIndex: 1}]}
                data={users}
                renderItem={renderUserItem}
                keyExtractor={user => user._id}
            />*/

export default UsersListView;