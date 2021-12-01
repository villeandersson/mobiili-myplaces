import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MapView, { Marker } from "react-native-maps";
import { Header, Input, Button, ListItem } from "react-native-elements";

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [haku, setHaku] = useState("");
  const [index, setIndex] = useState(0);
  const [osoite, setOsoite] = useState("");
  const [osoitteet, setOsoitteet] = useState([]);

  const saveAddress = () => {
    setOsoitteet([...osoitteet, { key: index, value: osoite }]);
    setIndex(index + 1);
  };

  return (
    <View style={styles.container}>
      <Input
        style={{ fontSize: 18, height: 40 }}
        placeholder="Enter an address"
        onChangeText={
          ((text) => setHaku(text.split(" ").join(".")),
          (text) => setOsoite(text))
        }
      />
      <Button
        raised
        type="outline"
        icon={{ name: "save" }}
        title="Save"
        onPress={saveAddress}
      />

      <FlatList
        style={{ width: "90%" }}
        data={osoitteet}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() => navigation.navigate("Map", { haku: item.value })}
          >
            <ListItem.Content>
              <ListItem.Title>{item.value}</ListItem.Title>
              <ListItem.Subtitle>{"show on map"}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

function MapScreen({ route, navigation }) {
  const { haku } = route.params;
  const apikey = "1uAzlJO6HCbGatKmhjRJO6fSVLByKizi";
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.322,
    longitudeDelta: 0.221,
  });

  function getCoords(haku) {
    fetch(
      `https://www.mapquestapi.com/geocoding/v1/address?key=${apikey}&location=${haku}`,
      console.log(
        `https://www.mapquestapi.com/geocoding/v1/address?key=${apikey}&location=${haku}`
      )
    )
      .then((response) => response.json())
      .then((responseJson) =>
        setRegion({
          latitude: responseJson["results"][0]["locations"][0]["latLng"]["lat"],
          longitude:
            responseJson["results"][0]["locations"][0]["latLng"]["lng"],

          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        })
      )
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  }

  useEffect(() => {
    getCoords(haku);
  }, []);

  return (
    <View>
      <MapView style={{ height: "100%" }} region={region}>
        <Marker coordinate={region} />
      </MapView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="My Places" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
