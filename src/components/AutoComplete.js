import React from 'react';
import {Button, Text, View} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import {commonStyles} from "../commonStyles";

export const AutoComplete = (props) => {

    const [place, setPlace] = React.useState(null);

    const openSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal({
            country: props.country
        })
            .then((place) => {
                setPlace(place);
                props.setPlace(place);
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    };

    return (
        <View>
            {place ? <Text style={[commonStyles.fwbold, commonStyles.fs18]}> {place.name}</Text> : null}
            {place ? <Text>{place.address}</Text> : null}
            <Button
                onPress={() => openSearchModal()}
                title={'Select a Venue'}
            />
        </View>
    );
};