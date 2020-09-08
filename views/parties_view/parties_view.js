import React, { useEffect, useState } from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { BodyContainer, ListContainer } from '../../components/component_containers';
import { UserContext } from '../../context/user_context';
import { AppStyles, APP_COLOR } from '../../styles';
import AddPartyOverlay from './add_party_overlay';

const PartiesListView = (props) => {

    const currentUser = React.useContext(UserContext);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [parties, setParties] = useState([]);
    const [showAddOverlay, setShow] = useState(false);

    const getPartiesForUser = () => {
        currentUser.getPartiesForUser()
            .then(parties => {
                setParties(parties);
                setLoading(false);
            })
            .catch(console.log);
    };

    useEffect(() => {
        getPartiesForUser()
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        currentUser.loadPartiesForUser()
            .then(parties => {
                setParties(parties);
                setRefreshing(false);
            })
            .catch(console.log);
    }

    const renderPartyItem = (party) => {
        const onPress = () => {
            props.navigation.navigate("Party review", { party })
        };
        const numberOfMembers = party.users.length + party.dummies.length;
        return(
            <ListItem 
                title={party.name}
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
                key={party._id}
            />
        );
    }

    return(
        <BodyContainer>
            <ListContainer isLoading={loading} refreshing={refreshing} onRefresh={onRefresh}>
                { parties.map(renderPartyItem) }
            </ListContainer>
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
                updateParties={getPartiesForUser}
            />
        </BodyContainer>
    )
}

export default PartiesListView;