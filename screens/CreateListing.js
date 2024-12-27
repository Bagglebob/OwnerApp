import { StyleSheet, Text, View, TextInput, Switch, Button, Pressable, ScrollView, } from 'react-native';
import { useState, useEffect } from "react"
import { signOut } from "firebase/auth";

import * as Location from "expo-location"
// TODO: import the required service from FirebaseConfig.js
import { auth, db } from '../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";


export default function CreateListing({ navigation }) {
    const [usernameLabel, setUsernameLabel] = useState("username goes here")
    const [profileLabel, setProfileLabel] = useState("Your user profile data goes here")

    // form fields
    const [listingTitle, setListingTitle] = useState()
    const [address, setAddress] = useState()
    const [city, setCity] = useState()
    const [rooms, setRooms] = useState(0)    
    const [pool, setPool] = useState(false)
    const [imageURL, setImageURL] = useState()   
    const [price, setPrice] = useState() 

    const toggleSwitch = () => {
        console.log("Has Pool before switch: ", pool)
        pool===true ? setPool(false) : setPool(true);
        console.log("Has Pool: ", pool);
    };

    // add a navigation bar to the header
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={logoutPressed} title="Logout" />
            ),

        })
    }, [navigation])

    // when the screen loads for the first time, output the name of the logged in user
    useEffect(() => {
        requestPermissions();
    }, [])

    const requestPermissions = async () => {
        try {
            const permissionsObject =
                await Location.requestForegroundPermissionsAsync()
            if (permissionsObject.status !== "granted") {
                alert("Permission denied or not provided")
            }
        } catch (err) {
            console.log(err)
        }
    }


    const buttonPressed = async () => {
        if (auth.currentUser == null) {
            setProfileLabel("No one Logged in!")
        } else {
            setProfileLabel(`Logged in user is: ${auth.currentUser.uid}`)
        }
    }

    const logoutPressed = async () => {
        console.log("LOG OUT PRESSED!")
        // TODO: Code to logout
        try {
            if (auth.currentUser === null) {
                console.log("logoutPressed: There is no user to logout!")
            } else {
                await signOut(auth)
                console.log("logoutPressed: Logout complete")
                alert("logout complete!")
                navigation.reset({index: 0, routes: [{ name: "Login" }],})
            }
        } catch (error) {
            console.log("ERROR when logging out")
            console.log(error)
        }
    }
 // converts the specified human readable address to coordinates
 const doFwdGeocode = async (address) => {
    try {
        const geocodedLocation = await Location.geocodeAsync(address);

        const result = geocodedLocation[0];

        return result;

    } catch (err) {
        console.log(err);
    }
}
    const addListing = async () => {

        const result = await doFwdGeocode(address);
        const listingToInsert = {
            listingTitle: listingTitle,           
            address: address,
            city: city,
            rooms: rooms,           
            pool: pool, 
            postedBy: auth.currentUser.uid,
            image: imageURL,
            price: price,
            latitude: result.latitude,
            longitude: result.longitude
        }
 
        // insert into database
        try {
            const docRef = await addDoc(collection(db, "listings"), listingToInsert)
            alert("Data inserted, check console for output")
            console.log(`Id of inserted document is: ${docRef.id}`)
 
        } catch (err) {
            console.log(err)
        }
   }

    return (
        <View style={styles.container}>
            <Text style={styles.headingText}>Create a Listing here!</Text>
            
{/* 
            <Text>{profileLabel}</Text>

           
            <Pressable onPress={logoutPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Logout?</Text>
            </Pressable>

            
            <Pressable onPress={buttonPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Is someone Logged in?</Text>
            </Pressable> 
*/}
            <ScrollView style={styles.form}>
                <Text style={styles.title}>Listing Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Listing Title"
                    value={listingTitle}
                    onChangeText={setListingTitle}
                    autoCapitalize="none"
                />

                <Text style={styles.title}>Listing Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Address..."
                    value={address}
                    onChangeText={setAddress}
                />

                <Text style={styles.title}>Listing City</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter City..."
                    value={city}
                    onChangeText={setCity}
                />

                <Text style={styles.title}>Number of Rooms</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Number of Rooms..."
                    value={rooms}
                    onChangeText={setRooms}
                    // this wont work, figure out how enter numbers only
                    keyboardType="numeric"
                />

                <Text style={styles.title}>Price per night</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Price per night..."
                    value={price}
                    onChangeText={setPrice}                   
                />

                <Text style={styles.title}>Image URL (Must be Web URL) </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Image URL..."
                    value={imageURL}
                    onChangeText={setImageURL}                    
                />

                <Text style={styles.title}>Is there a Pool?</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={pool ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={pool}
                />
                <Pressable style={styles.button} onPress={addListing}>
                    <Text style={styles.buttonText}>Submit Listing</Text>
                </Pressable>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    form: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 10,

    },
    btn: {
        borderWidth: 1,
        borderColor: "#141D21",
        borderRadius: 8,
        paddingVertical: 16,
        marginVertical: 2,
    },
    btnLabel: {
        fontSize: 16,
        textAlign: "center"
    },
    headingText: {
        fontSize: 20,
        paddingVertical: 8,
        textAlign: "center"
    },
    text: {
        fontSize: 18,
        paddingVertical: 8
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 100,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

});
