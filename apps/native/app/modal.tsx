import { Pressable, StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function Modal() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

	return (
		<Container>
			<View style={styles.container}>
				<View style={styles.modalContent}>
					<View style={{ gap: 12, alignItems: "center" }}>
						<Text
							style={{ color: theme.text, fontSize: 20, fontWeight: "bold" }}
						>
							Modal
						</Text>
						<Text
							style={{
								color: theme.text,
								fontSize: 14,
								textAlign: "center",
								opacity: 0.7,
							}}
						>
							Modal content
						</Text>
						<Pressable
							style={[styles.outlinedButton, { borderColor: theme.text }]}
							onPress={() => null}
						>
							<Text style={{ color: theme.text, fontSize: 14 }}>
								Native control
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	modalContent: {
		alignSelf: "stretch",
		padding: 16,
	},
	outlinedButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderWidth: 1,
		borderRadius: 8,
		alignItems: "center",
	},
});
