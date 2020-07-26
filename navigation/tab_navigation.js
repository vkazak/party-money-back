import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DummiesNavigator } from "./dummies_navigation";
import { PartiesNavigator } from "./parties_navigation";

const Tab = createBottomTabNavigator();

export const TabNavigator = (props) => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name='Party navigation'
                component={PartiesNavigator}
            />
            <Tab.Screen
                name='Dummies navigation'
                component={DummiesNavigator}
            /> 
        </Tab.Navigator>
    )
}