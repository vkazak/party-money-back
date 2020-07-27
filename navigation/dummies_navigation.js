import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigatorStyle } from "../styles";
import DummiesListView from "../views/dummies_view/dummies_view";

const Stack = createStackNavigator();

export const DummiesNavigator = (props) => {
    return(
        <Stack.Navigator screenOptions={ NavigatorStyle }>
            <Stack.Screen
                name='Dummies view'
                component={DummiesListView}
            />
        </Stack.Navigator>
    )
}