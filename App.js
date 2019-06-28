import React from 'react';
import AppNavigator from "./src/navigation/navigation";
import {createGlobalState} from 'react-hooks-global-state';

const initialState = {
    profile: null,
    gameDetails: null,
    sports: [],
    games: [],
    token: null
};
export const {GlobalStateProvider, useGlobalState} = createGlobalState(initialState);



export const App = () => {
    return (
        <GlobalStateProvider>
            <AppNavigator/>
        </GlobalStateProvider>
    );
};
