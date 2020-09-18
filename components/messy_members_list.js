import { observer } from 'mobx-react';
import React from 'react';
import { Avatar, Icon, ListItem } from 'react-native-elements';
import { AppStyles, APP_COLOR, APP_FONT } from '../styles';
import { ScrollView, Text, TouchableHighlight, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { BodyContainer } from './component_containers';

const StyleConst = {
    ITEM_HEIGHT: 60,
    ITEM_BORDER_RADIUS: 16,
    ITEM_BORDER_COLOR: APP_COLOR,
    ITEM_BACKGROUND_COLOR: APP_COLOR + '40',
}

function EditMessyListButton(props) {
    return(
        <TouchableHighlight
            activeOpacity={0.6}
            underlayColor={APP_COLOR + '30'}
            onPress={props.onPress}
            style={EditMessyListButtonStyle.touchableHighlight}
        >
            <View style={MessyMemberListStyle.itemContainer}>
                <Icon
                    name='edit'
                    type='font-awesome'
                    color={APP_COLOR}
                    size={40}
                />
                <Text style={EditMessyListButtonStyle.title}>Edit</Text> 
            </View>
        </TouchableHighlight>
    )
}

const EditMessyListButtonStyle = StyleSheet.create({
    title: {
        fontFamily: APP_FONT,
        fontSize: 13,
        marginHorizontal: 10,
        color: APP_COLOR
    },
    touchableHighlight: {
        borderRadius: StyleConst.ITEM_BORDER_RADIUS,
    }
});

function MessyMemberItem(props) {
    
    return(
        <View style={MessyMemberListStyle.itemContainer}>
            <Avatar 
                source={{ url: props.member.photoUrl }}
                size={40}
                rounded
            />
            <Text style={MessyMemberListStyle.memberName} numberOfLines={3}>{props.member.name}</Text> 
        </View>
    )
}

export class MessyMembersList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={MessyMemberListStyle.container}>
                <EditMessyListButton onPress={this.props.onEdit}/>
                {this.props.members.map(member => <MessyMemberItem member={member} key={member._id}/>)}
            </View>
        )
    }
}

const MessyMemberListStyle = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    itemContainer: {
        flexBasis: 'auto',
        margin: 4,
        padding: 8,
        height: StyleConst.ITEM_HEIGHT,
        borderRadius: StyleConst.ITEM_BORDER_RADIUS,
        borderColor: StyleConst.ITEM_BORDER_COLOR,
        backgroundColor: StyleConst.ITEM_BACKGROUND_COLOR,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    memberName: {
        fontFamily: APP_FONT,
        fontSize: 13,
        marginLeft: 8,
        opacity: 0.6,
    }
});