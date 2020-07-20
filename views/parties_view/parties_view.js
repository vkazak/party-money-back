import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View, ScrollView } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import makeFullUrl from '../../utils';
import commonStyles, { MAIN_COLOR, APP_COLOR } from '../../styles';
import AddPartyOverlay from './add_party_overlay';

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
                onPress={onPress}
                chevron
            />
        );
    }

    const addPartyToTheList = (party) => {
        setParties(parties.slice().concat([party]));
    }

    return(
        <View style={{backgroundColor: APP_COLOR, flex: 1}}>
            <ScrollView style={commonStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden',}}>
                    {parties.map(party => {
                        return(renderPartyItem({item: party}))
                    })}
                </View>
            </ScrollView>
            <Icon 
                containerStyle={commonStyles.floatingIconButton}
                name='add'
                color={MAIN_COLOR}
                onPress={() => setShow(true)}
                reverse
            />
            <AddPartyOverlay
                isVisible={showAddOverlay}
                onClose={() => setShow(false)}
                userId={userId}
                addPartyToTheList={addPartyToTheList}
            />
        </View>
    )
}
/*<FlatList 
                style={commonStyles.block}
                data={parties}
                renderItem={renderPartyItem}
                keyExtractor={party => party._id}
            />*/
export default PartiesListView;