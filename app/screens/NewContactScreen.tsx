import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps, ChatScreenProps } from "../navigators"
import { Screen, Text, TextField, Button } from "../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { colors, spacing } from "../theme"

export const NewContactScreen: FC<StackScreenProps<ChatScreenProps<"NewContact">>> = observer(function NewContactScreen() {
  const { chatStore: { newContact: { setName, setId, name, _id, clear }, addContactAndCreateChat}, } = useStores()
  const navigation = useNavigation()
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text tx="createContact.message" />

      <TextField
        value={name}
        onChangeText={setName}
        containerStyle={$textField}
        autoCapitalize="none"
        keyboardType="email-address"
        labelTx="createContact.name.label"
        placeholderTx="createContact.name.placeholder"
      />


      <TextField
        value={_id}
        onChangeText={setId}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        labelTx="createContact.name.label"
        placeholderTx="createContact.name.placeholder"
      />


      <Button
        testID="scan-button"
        tx="createContact.btScan"
        style={$tapButton}
        preset="reversed"
        onPress={() => {
            navigation.navigate("ScanNewContact")
        }}
      />
      <Button
        testID="save-button"
        tx="createContact.btSave"
        style={$tapButton}
        preset="reversed"
        onPress={() => {
          addContactAndCreateChat().then(()=>{
            clear()
            navigation.navigate("Chat")
          }) 
        }}
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