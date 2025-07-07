import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Alert,
  useColorScheme,
  FlatList,
  TextInput,
  ImageSourcePropType,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
  interpolateColor,
  withRepeat,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Smooth Gradient Fade Component
const GradientFade = ({ theme }: { theme: "light" | "dark" }) => {
  const gradientColors: [string, string, ...string[]] = theme === "dark"
    ? [
        "rgba(74, 0, 0, 0)",
        "rgba(74, 0, 0, 0.05)",
        "rgba(58, 0, 0, 0.1)",
        "rgba(42, 0, 0, 0.15)",
        "rgba(26, 0, 0, 0.2)",
        "rgba(10, 0, 0, 0.25)",
        "rgba(0, 0, 0, 0.3)",
      ]
    : [
        "rgba(139, 0, 0, 0)",
        "rgba(139, 0, 0, 0.03)",
        "rgba(139, 0, 0, 0.06)",
        "rgba(139, 0, 0, 0.09)",
        "rgba(139, 0, 0, 0.12)",
        "rgba(139, 0, 0, 0.15)",
        "rgba(139, 0, 0, 0.18)",
      ];

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.bottomGradient}
      pointerEvents="none"
    />
  );
};

// Change Username Modal Component
const ChangeUsernameModal = ({
  visible,
  currentName,
  onClose,
  onSave,
  theme,
}: {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
  theme: "light" | "dark";
}) => {
  const [newName, setNewName] = useState(currentName);
  const modalOpacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    modalOpacity.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [visible]);

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
  }));

  const handleSave = () => {
    if (newName.trim()) {
      onSave(newName.trim());
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.modalOverlay, animatedModalStyle]}>
      <View
        style={[
          styles.modalContent,
          { backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff" },
        ]}
      >
        <Text
          style={[
            styles.modalTitle,
            { color: theme === "dark" ? "#f5f5f5" : "#333" },
          ]}
        >
          Change Username
        </Text>
        <TextInput
          style={[
            styles.modalInput,
            {
              backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
              color: theme === "dark" ? "#f5f5f5" : "#333",
              borderColor: theme === "dark" ? "#444" : "#ddd",
            },
          ]}
          value={newName}
          onChangeText={setNewName}
          placeholder="Enter new username"
          placeholderTextColor={theme === "dark" ? "#888" : "#666"}
          autoFocus
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Carousel Item Component
const CarouselItem = ({ imageUrl, theme }: { imageUrl: string; theme: "light" | "dark" }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={() => {
        scale.value = withTiming(0.95, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 100 });
      }}
    >
      <Animated.View
        style={[
          styles.carouselItem,
          animatedStyle,
          {
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
            borderColor: theme === "dark" ? "#444" : "#ddd",
          },
        ]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Carousel Section Component
const CarouselSection = ({ theme }: { theme: "light" | "dark" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);
 const carouselImages = [
  require('../assets/images/i1.png'),
  require('../assets/images/i2.png'),
  require('../assets/images/i3.png'),
];


  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % carouselImages.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3000); // Auto-scroll every 3 seconds
    return () => clearInterval(interval);
  }, [activeIndex]);

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  };

  return (
    <View style={styles.carouselContainer}>
      <Text style={[styles.carouselTitle, { color: theme === "dark" ? "#f5f5f5" : "#333" }]}>
        Highlights
      </Text>
      <FlatList
        ref={flatListRef}
        data={carouselImages}
        renderItem={({ item }) => <CarouselItem imageUrl={item} theme={theme} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />
      <View style={styles.pagination}>
        {carouselImages.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: theme === "dark" ? "#fff" : "#8B0000",
                transform: [
                  {
                    scale: index === activeIndex ? 1.2 : 0.8,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Welcome Overlay Component
const WelcomeOverlay = ({ name, onComplete }: { name: string; onComplete: () => void }) => {
  const opacity = useSharedValue(1);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const fullText = `Welcome, ${name}`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTypingDone(true);
        opacity.value = withDelay(
          3000,
          withTiming(0, { duration: 500 }, () => {
            runOnJS(onComplete)();
          })
        );
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.overlay, animatedStyle]}>
      <Text style={styles.overlayText}>{typedText}</Text>
      {typingDone && (
        <Text style={styles.subText}>
          Welcome to <Text style={styles.klConnectText}>KL Connect</Text>
        </Text>
      )}
    </Animated.View>
  );
};

// Liquid Loader Component
const LiquidLoader = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      true
    );
    return () => {
      progress.value = 0;
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = progress.value * 0.3 + 0.8;
    const width = 60 + progress.value * 20;
    const height = 60 - progress.value * 10;
    const borderRadius = progress.value * 70 + 10;
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      ["#8B0000", "#FF4500", "#DC143C"]
    );

    return {
      transform: [{ scale }],
      width,
      height,
      backgroundColor,
      borderRadius,
    };
  });

  return <Animated.View style={[styles.liquidLoader, animatedStyle]} />;
};

// Feature Card Component
const FeatureCard = ({
  title,
  imageSource,
  url,
  onPick,
  theme,
}: {
  title: string;
  imageSource: ImageSourcePropType;
  url: string;
  onPick: (url: string) => void;
  theme: "light" | "dark";
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPick(url)}
      style={[
        styles.card,
        { backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff" },
      ]}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={imageSource}
          style={styles.cardImage}
          resizeMode="contain"
          onError={(e) => console.log(`Image load error for ${title}:`, e.nativeEvent.error)}
        />
      </View>
      <Text
        style={[
          styles.cardText,
          {
            color: theme === "dark" ? "#f5f5f5" : "#8B0000",
            textShadowColor: theme === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Web Modal Component
const WebModal = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.webModal}>
      {isLoading && (
        <View style={[styles.webLoader, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
          <LiquidLoader />
        </View>
      )}
      <WebView
        source={{ uri: url }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        style={{ flex: 1 }}
      />
    </View>
  );
};

// Home Screen Component
const HomeScreen = ({
  name,
  theme,
  toggleTheme,
  onNameChange,
}: {
  name: string;
  theme: "light" | "dark";
  toggleTheme: () => void;
  onNameChange: (newName: string) => void;
}) => {
  const insets = useSafeAreaInsets();
  const width = useSharedValue(40);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const [webUrl, setWebUrl] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const themeTransition = useSharedValue(theme === "light" ? 0 : 1);

  // Image sources with fallbacks
  const featureCards = [
    {
      title: "KL ERP",
      imageSource: require(`../assets/images/Kl.png`),
      url: "https://newerp.kluniversity.in",
    },
    {
      title: "KL LMS",
      imageSource: require(`../assets/images/lms.png`),
      url: "https://lms.kluniversity.in",
    },
    {
      title: "KL EATS",
      imageSource: require(`../assets/images/eats.png`),
      url: "https://kleats.in",
    },
    {
      title: "Academic Portal",
      imageSource: require(`../assets/images/Kl.png`), // Fallback to placeholder if missing
      url: "https://academics.klef.in",
    },
  ];

  useEffect(() => {
    width.value = withSpring(SCREEN_WIDTH - 30, {
      damping: 8,
      stiffness: 90,
    });
    opacity.value = withTiming(1, { duration: 800 });
    textOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    themeTransition.value = withTiming(theme === "light" ? 0 : 1, { duration: 300 });
  }, [theme]);

  useEffect(() => {
    const backHandler = () => {
      if (showUsernameModal) {
        setShowUsernameModal(false);
        return true;
      }
      if (webUrl) {
        setWebUrl(null);
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", backHandler);
    return () => sub.remove();
  }, [webUrl, showUsernameModal]);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      themeTransition.value,
      [0, 1],
      ["#f5f5f5", "#121212"]
    ),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(themeTransition.value, [0, 1], ["#333", "#f5f5f5"]),
  }));

  const headerStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8B0000",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const openWeb = (url: string) => setWebUrl(url);
  const closeWeb = () => setWebUrl(null);

  const handleUsernameChange = (newName: string) => {
    onNameChange(newName);
    setShowUsernameModal(false);
  };

  return (
    <Animated.View style={[styles.container, animatedBackgroundStyle]}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} translucent />
        <Animated.View style={[headerStyle, styles.shadow]}>
          <Animated.Text style={[styles.headerText, textStyle]}>
            KL Connect
          </Animated.Text>
          <Animated.Text style={[styles.welcomeHeaderText, textStyle]}>
            Welcome, {name}
          </Animated.Text>
        </Animated.View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.cardsContainer}>
            {featureCards.map((card, index) => (
              <FeatureCard
                key={index}
                title={card.title}
                imageSource={card.imageSource}
                url={card.url}
                onPick={openWeb}
                theme={theme}
              />
            ))}
          </View>
          <CarouselSection theme={theme} />
          <View style={styles.infoContainer}>
            <Animated.Text style={[styles.infoTitle, animatedTextStyle]}>
              About KL University
            </Animated.Text>
            <Animated.Text style={[styles.infoText, animatedTextStyle]}>
              KL University, founded in 1980, is a leading institution of higher
              education in India, known for its engineering and technical programs.
            </Animated.Text>
            <Animated.Text style={[styles.infoTitle, animatedTextStyle, { marginTop: 20 }]}>
              About Me
            </Animated.Text>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/60" }}
                style={styles.profilePic}
              />
              <View style={{ marginLeft: 10 }}>
                <Animated.Text style={[styles.infoText, animatedTextStyle]}>
                  Avinash – React Native Dev
                </Animated.Text>
                <TouchableOpacity
                  style={styles.githubBtn}
                  onPress={() => openWeb("https://github.com/Avinash-006")}
                >
                  <Image
                    source={{
                      uri: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
                    }}
                    style={styles.githubLogo}
                  />
                  <Animated.Text
                    style={[styles.githubText, { color: theme === "dark" ? "#fff" : "#0366d6" }]}
                  >
                    GitHub
                  </Animated.Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.changeUsernameContainer}>
            <TouchableOpacity
              style={[
                styles.changeUsernameBtn,
                {
                  backgroundColor: theme === "dark" ? "#8B0000" : "#8B0000",
                  borderColor: theme === "dark" ? "#666" : "#ddd",
                },
              ]}
              onPress={() => setShowUsernameModal(true)}
            >
              <Icon name="user" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.changeUsernameText}>Change Username</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {!webUrl && (
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.themeToggleBtn,
              {
                backgroundColor: theme === "dark" ? "#fff" : "#333",
                zIndex: 20,
              },
            ]}
          >
            <Icon
              name={theme === "dark" ? "sun" : "moon"}
              size={20}
              color={theme === "dark" ? "#333" : "#fff"}
            />
          </TouchableOpacity>
        )}
        {!webUrl && <GradientFade theme={theme} />}
        {webUrl && <WebModal url={webUrl} onClose={closeWeb} />}
        <ChangeUsernameModal
          visible={showUsernameModal}
          currentName={name}
          onClose={() => setShowUsernameModal(false)}
          onSave={handleUsernameChange}
          theme={theme}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

// Main App Component
export default function App() {
  const systemTheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [name, setName] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(systemTheme || "light");

  useEffect(() => {
    if (systemTheme) {
      setTheme(systemTheme);
      AsyncStorage.setItem("theme", systemTheme);
    }
  }, [systemTheme]);

  useEffect(() => {
    const init = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        const storedTheme = await AsyncStorage.getItem("theme");

        const initialTheme = storedTheme as "light" | "dark" || systemTheme || "light";
        setTheme(initialTheme);

        if (storedName) {
          setName(storedName);
          if (!hasLaunched) {
            setShowWelcome(true);
            await AsyncStorage.setItem("hasLaunched", "true");
          }
        } else {
          router.push("/NamePromptScreen");
        }
      } catch (e) {
        console.error("App init error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    if (fontsLoaded || fontError) init();
  }, [fontsLoaded, fontError]);

  const onDoneWelcome = async () => {
    setShowWelcome(false);
    const passwordPromptShown = await AsyncStorage.getItem("passwordPromptShown");
    if (!passwordPromptShown) {
      Alert.alert(
        "Import Passwords",
        "Would you like to import your saved passwords from Google Password Manager?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => console.log("User accepted import prompt") },
        ]
      );
      await AsyncStorage.setItem("passwordPromptShown", "true");
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const handleNameChange = async (newName: string) => {
    setName(newName);
    await AsyncStorage.setItem("userName", newName);
  };

  if (isLoading || (!fontsLoaded && !fontError)) {
    return (
      <View style={[styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {showWelcome && name ? (
        <WelcomeOverlay name={name} onComplete={onDoneWelcome} />
      ) : (
        <HomeScreen
          name={name ?? "Guest"}
          theme={theme}
          toggleTheme={toggleTheme}
          onNameChange={handleNameChange}
        />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 160 },
  shadow: {
    marginTop: 15,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.6, shadowRadius: 10 },
      android: { elevation: 12 },
    }),
  },
  headerText: { color: "#fff", fontSize: 20, fontFamily: "Poppins_700Bold" },
  welcomeHeaderText: { color: "#fff", fontSize: 16, fontFamily: "Poppins_400Regular" },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    width: "48%",
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
    overflow: "hidden",
    paddingBottom: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 6 },
      android: { elevation: 6 },
    }),
  },
  cardImageContainer: {
    width: "100%",
    height: 100,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  carouselContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  carouselTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    marginBottom: 15,
    marginLeft: 5,
  },
  carouselItem: {
    width: SCREEN_WIDTH - 30,
    height: 200,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  infoContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  infoTitle: { fontFamily: "Poppins_700Bold", fontSize: 18 },
  infoText: { fontFamily: "Poppins_400Regular", fontSize: 14, marginTop: 5 },
  profileContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  profilePic: { width: 60, height: 60, borderRadius: 30 },
  githubBtn: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  githubLogo: { width: 20, height: 20, marginRight: 6 },
  githubText: { fontFamily: "Poppins_700Bold", fontSize: 14 },
  changeUsernameContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  changeUsernameBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    minWidth: 180,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  changeUsernameText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
      android: { elevation: 15 },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#8B0000",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  webModal: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 100,
  },
  webLoader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  liquidLoader: {
    width: 60,
    height: 60,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: { fontSize: 28, fontFamily: "Poppins_700Bold", textAlign: "center", color: "#333" },
  subText: { fontSize: 20, fontFamily: "Poppins_400Regular", marginTop: 8, textAlign: "center", color: "#444" },
  klConnectText: { color: "#8B0000", fontFamily: "Poppins_700Bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  themeToggleBtn: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    zIndex: -1,
    pointerEvents: "none",
  },
});