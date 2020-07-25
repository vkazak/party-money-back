import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import commonStyles, { APP_COLOR, APP_FONT } from '../../styles';
import AddPartyOverlay from './add_party_overlay';
import { BodyContainer } from '../../components/component_containers';

const PartiesListView = (props) => {

    const user = props.route.params.user;

    const [parties, setParties] = useState([]);
    const [showAddOverlay, setShow] = useState(false);
    
    const loadPartiesForUser = () => {
        user.getPartiesForUser()
            .then(setParties)
            .catch(console.log);
    };

    useEffect(() => {
        loadPartiesForUser()
    }, []);

    const renderPartyItem = ({item}) => {
        const onPress = () => {
            props.navigation.navigate("Party review", {party: item, user})
        };
        const numberOfMembers = item.users.length + item.dummies.length;
        return(
            <ListItem 
                title={item.name}
                titleStyle={style.itemTitle}
                subtitle={`${numberOfMembers} member${numberOfMembers == 1 ? '' : 's'}`}
                subtitleStyle={style.itemSubtitle}
                onPress={onPress}
                leftIcon={{
                    name: 'ios-beer',
                    type: 'ionicon',
                    color: APP_COLOR,
                    size: 35
                }}
                chevron={{color: APP_COLOR}}
            />
        );
    }

    return(
        <BodyContainer>
            <ScrollView style={commonStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden', marginBottom: 20}}>
                    {parties.map(party => {
                        return( renderPartyItem({item: party, key: party._id}) )
                    })}
                </View>
            </ScrollView>
            <Icon 
                containerStyle={commonStyles.floatingIconButton}
                name='add'
                color={APP_COLOR}
                onPress={() => setShow(true)}
                reverse
            />
            <AddPartyOverlay
                isVisible={showAddOverlay}
                onClose={() => setShow(false)}
                currentUser={user}
                updateParties={loadPartiesForUser}
            />
        </BodyContainer>
    )
}

const style = StyleSheet.create({
    itemTitle: {
        fontFamily: APP_FONT
    },
    itemSubtitle: {
        fontFamily: APP_FONT,
        opacity: 0.4, 
        fontSize: 13
    }
});

export default PartiesListView;