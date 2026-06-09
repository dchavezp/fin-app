import { router, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function NotFoundScreen() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<Container>
				<View style={styles.container}>
					<View style={styles.content}>
						<Text style={styles.emoji}>🤔</Text>
						<View style={{ gap: 12, alignItems: "center" }}>
							<Text
								style={{
									color: theme.text,
									fontSize: 20,
									fontWeight: "bold",
									textAlign: "center",
								}}
							>
								Page Not Found
							</Text>
							<Text
								style={{
									color: theme.text,
									fontSize: 14,
									textAlign: "center",
									opacity: 0.7,
								}}
							>
								Sorry, the page you're looking for doesn't exist.
							</Text>
							<Pressable
								style={[styles.outlinedButton, { borderColor: theme.text }]}
								onPress={() => router.replace("/")}
							>
								<Text style={{ color: theme.text, fontSize: 14 }}>
									Go to Home
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Container>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	content: {
		alignItems: "center",
	},
	emoji: {
		fontSize: 48,
		marginBottom: 16,
	},
	outlinedButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderWidth: 1,
		borderRadius: 8,
		alignItems: "center",
	},
});
