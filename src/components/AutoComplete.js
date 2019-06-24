import React from 'react';
import {Button} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';

export const AutoComplete = (props) => {

    const openSearchModal = () => {
        console.log(props);
        RNGooglePlaces.openAutocompleteModal({
            country: props.country
        })
            .then((place) => {
                console.log(place);
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    };

    return (
        <Button
            onPress={() => openSearchModal()}
            title={'Select a Venue'}
        />
    );
};