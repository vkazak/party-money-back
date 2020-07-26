import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { AppStyles, APP_COLOR, APP_FONT } from '../../styles';
import AddPartyOverlay from './add_party_overlay';
import { BodyContainer } from '../../components/component_containers';
import { UserContext } from '../../context/user_context';

const PartiesListView = (props) => {

    const currentUser = React.useContext(UserContext);

    const [parties, setParties] = useState([]);
    const [showAddOverlay, setShow] = useState(false);
    
    const loadPartiesForUser = () => {
        currentUser.getPartiesForUser()
            .then(setParties)
            .catch(console.log);
    };

    useEffect(() => {
        loadPartiesForUser()
    }, []);

    const renderPartyItem = ({item}) => {
        const onPress = () => {
            props.navigation.navigate("Party review", {party: item})
        };
        const numberOfMembers = item.users.length + item.dummies.length;
        return(
            <ListItem 
                title={item.name}
                titleStyle={AppStyles.listTitle}
                subtitle={`${numberOfMembers} member${numberOfMembers == 1 ? '' : 's'}`}
                subtitleStyle={AppStyles.listSubtitle}
                onPress={onPress}
                leftIcon={{
                    name: 'ios-beer',
                    type: 'ionicon',
                    color: APP_COLOR,
                    size: 35
                }}
                chevron={{color: APP_COLOR}}
                key={item._id}
            />
        );
    }

    return(
        <BodyContainer>
            <ScrollView style={AppStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden', marginBottom: 20}}>
                    {parties.map(party => {
                        return( renderPartyItem({item: party}) )
                    })}
                </View>
            </ScrollView>
            <Icon 
                containerStyle={AppStyles.floatingIconButton}
                name='add'
                color={APP_COLOR}
                onPress={() => setShow(true)}
                reverse
            />
            <AddPartyOverlay
                isVisible={showAddOverlay}
                onClose={() => setShow(false)}
                currentUser={currentUser}
                updateParties={loadPartiesForUser}
            />
        </BodyContainer>
    )
}

export default PartiesListView;