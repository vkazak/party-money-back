import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View, ScrollView, StyleSheet } from 'react-native';
import { Icon, ListItem, Button } from 'react-native-elements';
import makeFullUrl from '../../utils';
import commonStyles, { MAIN_COLOR, APP_COLOR, APP_FONT } from '../../styles';
import AddPartyOverlay from './add_party_overlay';
import { BodyContainer } from '../../components/component_containers';

const PartiesListView = (props) => {

    const user = props.route.params.user;
    const userId = user._id;

    const [parties, setParties] = useState([]);
    const [showAddOverlay, setShow] = useState(false);
    
    useEffect(() => {
        axios.get(makeFullUrl(`/parties/by_user/${userId}`))
            .then(response => {
                setParties(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    const renderPartyItem = ({item}) => {
        const onPress = () => {
            props.navigation.navigate("Party review", {party: item, user})
        };
        return(
            <ListItem 
                title={item.name}
                titleStyle={style.itemTitle}
                subtitle={`${item.users.length} user${item.users.length > 1 ? 's' : ''}`}
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

    const addPartyToTheList = (party) => {
        setParties(parties.slice().concat([party]));
    }

    return(
        <BodyContainer>
            <ScrollView style={commonStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden', marginBottom: 20}}>
                    {parties.map(party => {
                        return(renderPartyItem({item: party}))
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
                userId={userId}
                addPartyToTheList={addPartyToTheList}
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