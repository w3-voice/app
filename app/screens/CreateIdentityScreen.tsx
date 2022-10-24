import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text, TextField, Button } from "../components"
import { colors, spacing } from "../theme"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"

export const CreateIdentityScreen: FC<StackScreenProps<AppStackScreenProps, "CreateIdentity">> = observer(function CreateIdentityScreen() {
  // Pull in one of our MST stores
  const { identity: {name, newIdentity, setName} } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const handleNewIdentity = () => {
    newIdentity(name)
  }

  return (
    <Screen 
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text tx="createIdentity.title" />
      <Text tx="createIdentity.message" />

      <TextField
        value={name}
        onChangeText={setName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="createIdentity.instruction"
        placeholderTx="createIdentity.instruction"
        // helper={errors?.authEmail}
        // status={errors?.authEmail ? "error" : undefined}
        // onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <Button
        testID="login-button"
        tx="createIdentity.instruction"
        style={$tapButton}
        preset="reversed"
        onPress={handleNewIdentity}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $signIn: TextStyle = {
  marginBottom: spacing.small,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.large,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.medium,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
}