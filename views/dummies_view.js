import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { BodyContainer } from '../components/component_containers';
import { AppStyles, APP_FONT } from '../styles';
import { UserContext } from '../context/user_context';

const DummiesListView = (props) => {

    const [dummies, setDummies] = useState([]);
    const currentUser = React.useContext(UserContext);

    useEffect(() => {
        currentUser.getDummiesAsUsers()
            .then(setDummies)
            .catch(console.log)
    }, []);

    const renderDummyItem = ({item}) => {

        return(
            <ListItem 
                title={item.name}
                titleStyle={AppStyles.listTitle}
                leftAvatar={{
                    source: { url: item.photoUrl },
                    rounded: true
                }}
            />
        );
    }

    return(
        <BodyContainer>
            <View style={AppStyles.block}>
                <View style={{borderRadius: 15, overflow: 'hidden'}}>
                    {dummies.map(dummy => {
                        return(renderDummyItem({item: dummy}))
                    })}
                </View>
            </View>
        </BodyContainer>
    )
}

export default DummiesListView;