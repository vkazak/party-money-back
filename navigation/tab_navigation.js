import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DummiesNavigator } from "./dummies_navigation";
import { PartiesNavigator } from "./parties_navigation";
import { Icon } from 'react-native-elements';
import { APP_COLOR } from '../styles';

const Tab = createBottomTabNavigator();

export const TabNavigator = (props) => {
    return (
        <Tab.Navigator 
            tabBarOptions={ tabBarOptions }
            screenOptions={ screenOptions }
            initialRouteName='Parties'
        >
            <Tab.Screen
                name='Dummies'
                component={DummiesNavigator}
            /> 
            <Tab.Screen
                name='Parties'
                component={PartiesNavigator}
            />
        </Tab.Navigator>
    )
}

const tabBarOptions = {
    activeTintColor: APP_COLOR, 
    inactiveTintColor: '#bbb', 
    showLabel: false,
    showIcon: true,
};

const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color }) => {
        let iconName;
        if (route.name === 'Parties') {
            iconName = 'home';
        }
        else if (route.name === 'Dummies') {
            iconName = 'user';
        }
        const iconSize = focused ? 27 : 22;
        return (
            <Icon 
                name={ iconName }
                size={ iconSize } 
                color={ color }
                type='font-awesome-5'
            />
        )
    },
  });