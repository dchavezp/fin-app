import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { FIN_DATA_THEME } from "@/lib/constants";

type AuthMode = "sign-in" | "sign-up";

const signInSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Email is required")
		.email("Enter a valid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Use at least 8 characters"),
});

const signUpSchema = signInSchema.extend({
	name: z
		.string()
		.trim()
		.min(1, "Name is required")
		.min(2, "Name must be at least 2 characters"),
});

const { colors, radii, sizes, spacing, typography } = FIN_DATA_THEME;

function getErrorMessage(error: unknown): string | null {
	if (!error) return null;

	if (typeof error === "string") return error;

	if (Array.isArray(error)) {
		for (const issue of error) {
			const message = getErrorMessage(issue);
			if (message) return message;
		}
		return null;
	}

	if (typeof error === "object" && error !== null) {
		const maybeError = error as { message?: unknown };
		if (typeof maybeError.message === "string") return maybeError.message;
	}

	return null;
}

function AuthFlow() {
	const router = useRouter();
	const [mode, setMode] = useState<AuthMode>("sign-in");
	const [error, setError] = useState<string | null>(null);
	const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

	const signInForm = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: signInSchema,
		},
		onSubmit: async ({ value, formApi }) => {
			await authClient.signIn.email(
				{
					email: value.email.trim(),
					password: value.password,
				},
				{
					onError(error) {
						setError(error.error?.message || "Failed to sign in");
					},
					onSuccess() {
						setError(null);
						formApi.reset();
						router.replace("/(drawer)");
					},
				},
			);
		},
	});

	const signUpForm = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		validators: {
			onSubmit: signUpSchema,
		},
		onSubmit: async ({ value, formApi }) => {
			await authClient.signUp.email(
				{
					name: value.name.trim(),
					email: value.email.trim(),
					password: value.password,
				},
				{
					onError(error) {
						setError(error.error?.message || "Failed to create account");
					},
					onSuccess() {
						setError(null);
						formApi.reset();
						router.replace("/(drawer)");
					},
				},
			);
		},
	});

	const activeForm = mode === "sign-in" ? signInForm : signUpForm;
	const title = mode === "sign-in" ? "Welcome Back" : "Create Account";
	const submitLabel = mode === "sign-in" ? "Login" : "Sign Up";
	const switchLabel =
		mode === "sign-in"
			? "Don't have an Account? Sign Up"
			: "Already have an Account? Login";

	async function handleGoogleSignIn() {
		setIsGoogleSubmitting(true);
		setError(null);

		try {
			await authClient.signIn.social(
				{
					provider: "google",
					callbackURL: "finn-app://",
					newUserCallbackURL: "finn-app://",
					errorCallbackURL: "finn-app://auth",
				},
				{
					onError(error) {
						setError(error.error?.message || "Failed to sign in with Google");
					},
					onSuccess() {
						router.replace("/(drawer)");
					},
				},
			);
		} finally {
			setIsGoogleSubmitting(false);
		}
	}

	function toggleMode() {
		setError(null);
		setMode((currentMode) =>
			currentMode === "sign-in" ? "sign-up" : "sign-in",
		);
	}

	return (
		<ScrollView
			contentContainerStyle={styles.scrollContent}
			contentInsetAdjustmentBehavior="automatic"
			keyboardShouldPersistTaps="handled"
			style={styles.screen}
		>
			<View style={styles.brandBlock}>
				<View style={styles.logoMark}>
					<MaterialCommunityIcons
						color={colors.black}
						name="chart-line"
						size={24}
					/>
				</View>
				<Text style={styles.brand}>FinData Pro</Text>
				<Text style={styles.title}>{title}</Text>
			</View>

			<View style={styles.formBlock}>
				<Pressable
					accessibilityLabel="Sign up with Google"
					accessibilityRole="button"
					disabled={isGoogleSubmitting}
					onPress={handleGoogleSignIn}
					style={({ pressed }) => [
						styles.googleButton,
						{ opacity: pressed || isGoogleSubmitting ? 0.72 : 1 },
					]}
				>
					{isGoogleSubmitting ? (
						<ActivityIndicator color={colors.primary} size="small" />
					) : (
						<View style={styles.googleContent}>
							<AntDesign color={colors.google} name="google" size={17} />
							<Text style={styles.googleText}>Sign up with Google</Text>
						</View>
					)}
				</Pressable>

				<View style={styles.dividerRow}>
					<View style={styles.divider} />
					<Text style={styles.dividerText}>OR SIGN IN WITH</Text>
					<View style={styles.divider} />
				</View>

				<activeForm.Subscribe
					selector={(state) => ({
						isSubmitting: state.isSubmitting,
						validationError: getErrorMessage(state.errorMap.onSubmit),
					})}
				>
					{({ isSubmitting, validationError }) => {
						const formError = error ?? validationError;

						return (
							<>
								{formError ? (
									<View style={styles.errorBox}>
										<Text selectable style={styles.errorText}>
											{formError}
										</Text>
									</View>
								) : null}

								{mode === "sign-up" ? (
									<signUpForm.Field name="name">
										{(field) => (
											<View style={styles.fieldGroup}>
												<Text style={styles.label}>Name</Text>
												<TextInput
													accessibilityLabel="Name"
													autoCapitalize="words"
													onBlur={field.handleBlur}
													onChangeText={(value) => {
														field.handleChange(value);
														if (error) setError(null);
													}}
													placeholder="Tanya Hill"
													placeholderTextColor={colors.muted}
													returnKeyType="next"
													style={styles.input}
													value={field.state.value}
												/>
											</View>
										)}
									</signUpForm.Field>
								) : null}

								{mode === "sign-in" ? (
									<>
										<signInForm.Field name="email">
											{(field) => (
												<View style={styles.fieldGroup}>
													<Text style={styles.label}>Email address</Text>
													<TextInput
														accessibilityLabel="Email address"
														autoCapitalize="none"
														autoComplete="email"
														keyboardType="email-address"
														onBlur={field.handleBlur}
														onChangeText={(value) => {
															field.handleChange(value);
															if (error) setError(null);
														}}
														placeholder="tanya.hill@example.com"
														placeholderTextColor={colors.muted}
														returnKeyType="next"
														style={styles.input}
														value={field.state.value}
													/>
												</View>
											)}
										</signInForm.Field>
										<signInForm.Field name="password">
											{(field) => (
												<View style={styles.fieldGroup}>
													<Text style={styles.label}>Password</Text>
													<View style={styles.passwordInputShell}>
														<TextInput
															accessibilityLabel="Password"
															autoComplete="password"
															onBlur={field.handleBlur}
															onChangeText={(value) => {
																field.handleChange(value);
																if (error) setError(null);
															}}
															onSubmitEditing={signInForm.handleSubmit}
															placeholder="Password"
															placeholderTextColor={colors.muted}
															returnKeyType="done"
															secureTextEntry
															style={styles.passwordInput}
															value={field.state.value}
														/>
														<Feather
															color={colors.muted}
															name="eye-off"
															size={17}
														/>
													</View>
												</View>
											)}
										</signInForm.Field>
									</>
								) : (
									<>
										<signUpForm.Field name="email">
											{(field) => (
												<View style={styles.fieldGroup}>
													<Text style={styles.label}>Email address</Text>
													<TextInput
														accessibilityLabel="Email address"
														autoCapitalize="none"
														autoComplete="email"
														keyboardType="email-address"
														onBlur={field.handleBlur}
														onChangeText={(value) => {
															field.handleChange(value);
															if (error) setError(null);
														}}
														placeholder="tanya.hill@example.com"
														placeholderTextColor={colors.muted}
														returnKeyType="next"
														style={styles.input}
														value={field.state.value}
													/>
												</View>
											)}
										</signUpForm.Field>
										<signUpForm.Field name="password">
											{(field) => (
												<View style={styles.fieldGroup}>
													<Text style={styles.label}>Password</Text>
													<View style={styles.passwordInputShell}>
														<TextInput
															accessibilityLabel="Password"
															autoComplete="password"
															onBlur={field.handleBlur}
															onChangeText={(value) => {
																field.handleChange(value);
																if (error) setError(null);
															}}
															onSubmitEditing={signUpForm.handleSubmit}
															placeholder="Password"
															placeholderTextColor={colors.muted}
															returnKeyType="done"
															secureTextEntry
															style={styles.passwordInput}
															value={field.state.value}
														/>
														<Feather
															color={colors.muted}
															name="eye-off"
															size={17}
														/>
													</View>
												</View>
											)}
										</signUpForm.Field>
									</>
								)}

								{mode === "sign-in" ? (
									<View style={styles.signInExtras}>
										<Text style={styles.forgotText}>Forget password?</Text>
										<View style={styles.keepRow}>
											<View style={styles.checkbox} />
											<Text style={styles.keepText}>Keep me Login</Text>
										</View>
									</View>
								) : null}

								<Pressable
									accessibilityLabel={submitLabel}
									accessibilityRole="button"
									disabled={isSubmitting}
									onPress={activeForm.handleSubmit}
									style={({ pressed }) => [
										styles.primaryButton,
										{ opacity: pressed || isSubmitting ? 0.72 : 1 },
									]}
								>
									{isSubmitting ? (
										<ActivityIndicator color={colors.black} size="small" />
									) : (
										<Text style={styles.primaryButtonText}>{submitLabel}</Text>
									)}
								</Pressable>
							</>
						);
					}}
				</activeForm.Subscribe>

				<Pressable
					accessibilityLabel={switchLabel}
					accessibilityRole="button"
					onPress={toggleMode}
					style={styles.switchButton}
				>
					<Text style={styles.switchText}>{switchLabel}</Text>
				</Pressable>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: {
		backgroundColor: colors.background,
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.xxl,
	},
	brandBlock: {
		alignItems: "center",
		gap: spacing.sm,
		marginBottom: 29,
	},
	logoMark: {
		alignItems: "center",
		backgroundColor: colors.primary,
		borderRadius: radii.lg,
		height: sizes.logo,
		justifyContent: "center",
		width: sizes.logo,
	},
	brand: {
		color: colors.primary,
		fontSize: typography.brand,
		fontWeight: "800",
		lineHeight: 24,
	},
	title: {
		color: colors.muted,
		fontSize: typography.caption,
		fontWeight: "500",
	},
	formBlock: {
		gap: spacing.lg,
	},
	googleButton: {
		alignItems: "center",
		backgroundColor: colors.panel,
		borderColor: colors.line,
		borderRadius: radii.md,
		borderWidth: 1,
		height: sizes.socialButtonHeight,
		justifyContent: "center",
	},
	googleContent: {
		alignItems: "center",
		flexDirection: "row",
		gap: spacing.lg,
	},
	googleText: {
		color: colors.text,
		fontSize: typography.body,
		fontWeight: "500",
	},
	dividerRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: spacing.md,
		paddingHorizontal: 82,
	},
	divider: {
		backgroundColor: colors.line,
		flex: 1,
		height: 1,
	},
	dividerText: {
		color: colors.dividerText,
		fontSize: typography.micro,
		fontWeight: "700",
		letterSpacing: 0.8,
	},
	errorBox: {
		backgroundColor: colors.errorSurface,
		borderColor: colors.errorBorder,
		borderRadius: radii.md,
		borderWidth: 1,
		padding: 10,
	},
	errorText: {
		color: colors.error,
		fontSize: typography.caption,
		fontWeight: "600",
	},
	fieldGroup: {
		gap: spacing.xs,
	},
	label: {
		color: colors.text,
		fontSize: typography.label,
		fontWeight: "700",
	},
	input: {
		backgroundColor: colors.input,
		borderColor: colors.line,
		borderRadius: radii.md,
		borderWidth: 1,
		color: colors.text,
		fontSize: typography.body,
		height: sizes.inputHeight,
		paddingHorizontal: spacing.md,
	},
	passwordInputShell: {
		alignItems: "center",
		backgroundColor: colors.input,
		borderColor: colors.line,
		borderRadius: radii.md,
		borderWidth: 1,
		flexDirection: "row",
		height: sizes.inputHeight,
		paddingHorizontal: spacing.md,
	},
	passwordInput: {
		color: colors.text,
		flex: 1,
		fontSize: typography.body,
		padding: 0,
	},
	signInExtras: {
		gap: spacing.md,
	},
	forgotText: {
		alignSelf: "flex-end",
		color: colors.primary,
		fontSize: typography.label,
		fontWeight: "700",
	},
	keepRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: spacing.sm,
	},
	checkbox: {
		backgroundColor: colors.checkbox,
		borderColor: colors.line,
		borderRadius: radii.xs,
		borderWidth: 1,
		height: sizes.checkbox,
		width: sizes.checkbox,
	},
	keepText: {
		color: colors.muted,
		fontSize: typography.caption,
	},
	primaryButton: {
		alignItems: "center",
		backgroundColor: colors.primary,
		borderRadius: radii.md,
		height: sizes.primaryButtonHeight,
		justifyContent: "center",
	},
	primaryButtonText: {
		color: colors.black,
		fontSize: typography.button,
		fontWeight: "800",
	},
	switchButton: {
		alignItems: "center",
		paddingTop: spacing.xl,
	},
	switchText: {
		color: colors.muted,
		fontSize: typography.caption,
		fontWeight: "600",
	},
});

export { AuthFlow };
