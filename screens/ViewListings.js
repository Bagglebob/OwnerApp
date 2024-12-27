import { StyleSheet, Text, View, TextInput, Switch, Button, Pressable,Image, ScrollView, FlatList } from 'react-native';
import { useState, useEffect } from "react"
import { collection, getDocs, where, query, deleteField, updateDoc } from "firebase/firestore"
import { auth, db } from '../firebaseConfig';
import { signOut } from "firebase/auth";


export default function ViewListings({ navigation }) {
    const [userListings, setUserListings] = useState();
    const [key, setKey] = useState();

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
                navigation.reset({ index: 0, routes: [{ name: "Login" }], })
            }
        } catch (error) {
            console.log("ERROR when logging out")
            console.log(error)
        }
    }

    // add a navigation bar to the header
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={logoutPressed} title="Logout" />
            ),

        })
    }, [navigation])

    const getDocsWithUID = async () => {
        try {
            if (!auth.currentUser) {
                console.error("No user is currently logged in.");
                return;
            }

            // console.log(auth.currentUser.uid)
            const q = query(collection(db, "listings"), where("postedBy", "==", auth.currentUser.uid))
            const querySnapshot = await getDocs(q);

            // The QuerySnapshot object contains the documents retrieved from the collection
            // Use a forEach() loop to iterate through the documents and output relevant information
            let copy = [];
            querySnapshot.forEach((currDoc) => {
                const listingFromDb = {
                    docId: currDoc.id,                    
                    ...currDoc.data(),
                }
                //console.log("LISTING FROM DB",listingFromDb)
                copy.push(listingFromDb);
            })
            setUserListings(copy);

        } catch (err) {
            console.log(err)
        }
    }

    const cancelBooking = async (listing) => {
        console.log(listing.address)
        try {
            const q = query(
                collection(db, "listings"),
                where("address", "==", listing.address)
            );
            console.log("query", q)
            const querySnapshot = await getDocs(q);
            // querySnapshot.forEach((doc) => {
            //     console.log("Document data:", doc.data());
            // });
            const docRef = querySnapshot.docs[0].ref; // i dont remember where I found this. maybe in the firebase doc
            //console.log("docRef:",docRef)
            await updateDoc(docRef, { bookedBy: null });
            // await updateDoc(docRef, { bookedBy: deleteField() });
            alert("Deleted Booking!");

            // update Flatlist            
            // attempt 2
            // for(let i =0; i < userListings.length; i++){
            //     if(listing.docId === userListings.docId){
            //         delete userListings[i].bookedBy;
            //     }
            // }
            // let copy = {...userListings};
            // attempt 2

            const q2 = query(collection(db, "listings"), where("uid", "==", auth.currentUser.uid))
            const querySnapshot2 = await getDocs(q2);

            // The QuerySnapshot object contains the documents retrieved from the collection
            // Use a forEach() loop to iterate through the documents and output relevant information
            let copy = [];
            querySnapshot2.forEach((currDoc) => {
                //console.log(`Document id: ${currDoc.id}`)                
                //console.log(currDoc.data())
                const listingFromDb = {
                    docId: currDoc.id,                    
                    ...currDoc.data(),
                }
                console.log("LISTING after get",listingFromDb)
                copy.push(listingFromDb);
            })
            setUserListings([...copy]);
            // update Flatlist   END 
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getDocsWithUID();
    }, [userListings]) // just added this!!!! fixed my flatlist issue

    // useEffect(() => {
    //     console.log("User Listings:", userListings);
    // }, [userListings]);

    return (<>
        <FlatList
        style={{marginVertical:5, paddingVertical:5,}}
            data={userListings}
            keyExtractor={item => item.docId}
            extraData={userListings}
            renderItem={
                ({ item }) => (
                    <View style={styles.card}>
                        {item.image && (
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        )}

                        <Text style={styles.title}>{item.listingTitle}</Text>
                        <Text style={styles.text}>Address: {item.address}</Text>
                        <Text style={styles.text}>
                            Pool: {item.pool ? "Yes" : "No Pool"}
                        </Text>
                        <Text style={styles.text}>Rooms: {item.rooms}</Text>
                        <Text style={styles.text}>ID: {item.docId}</Text>
                        {item.bookedBy && (
                            <View style={styles.bookingContainer}>
                                <Text style={styles.text}>
                                    Booked by: {item.bookedBy}
                                </Text>
                                <Button
                                    title="Cancel Booking"
                                    onPress={() => cancelBooking(item)}
                                    color="#d9534f"
                                />
                            </View>
                        )}
                    </View>
                )
            }
            ItemSeparatorComponent={
                () => {
                    return (
                        <View style={{ marginVertical: 8 }}></View>
                    )
                }
            }
        />
    </>)
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        color: "#333",
        marginBottom: 4,
    },
    separator: {
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 8,
        marginHorizontal: 8,
    },
    bookingContainer: {
        marginTop: 12,
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
});
