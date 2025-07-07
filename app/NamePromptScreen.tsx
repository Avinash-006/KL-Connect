import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const NamePromptScreen: React.FC = () => {
  const [name, setName] = useState("");
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      try {
        await AsyncStorage.setItem("userName", trimmedName);
        await AsyncStorage.removeItem("seenWelcomeThisSession"); // Reset welcome flag for new user
        router.replace("/"); // Navigate to HomeScreen
      } catch (err) {
        console.error("Failed to save name:", err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent />
      <View style={[styles.promptContainer, { marginTop: insets.top + 10 }]}>
        <Text style={styles.promptText}>Enter Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
          placeholderTextColor="#999"
          autoFocus
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  promptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  promptText: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
  },
});

export default NamePromptScreen;
