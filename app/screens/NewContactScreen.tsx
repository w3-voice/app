import React, { FC, useEffect } from "react"
import { Observer, observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../navigators"
import { Screen, Text } from "../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { colors, spacing } from "../theme"
import { Appbar, Button, TextInput } from "react-native-paper"
import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types"
import { ErrorBanner } from "../components/ErrorBanner"

export const NewContactScreenHeaderRight = (_props: HeaderButtonProps) => {
  return (
    <NewContactScreenHeaderRightOB canGoBack={true}></NewContactScreenHeaderRightOB>
  )
}

const NewContactScreenHeaderRightOB:FC<HeaderButtonProps> = observer(function NewContactScreen(_props: HeaderButtonProps) {
  const { contactStore: {form: {valid, saving, err, name}, add} } = useStores()
  const navigation = useNavigation()
  const onPressDone = () => {
    add().then(() => {
      navigation.goBack()
    })
  }
  const onPressQRCScan = () => {
    navigation.navigate("ScanNewContact")
  }
  return (
    <>
      <Appbar.Action icon="qrcode-scan" onPress={onPressQRCScan}  />
      <Appbar.Action icon="check" onPress={onPressDone} disabled={!valid}/>
    </>
  )
})

export const NewContactScreen: FC<StackScreenProps<ChatScreenProps<"NewContact">>> = observer(function NewContactScreen() {
  const { contactStore: {form:{name, setName, _id, setId, err, reset}} } = useStores()
  const navigation = useNavigation()
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <ErrorBanner message={err} visible={!!err} done={reset}></ErrorBanner>
      <TextInput
        value={name}
        onChangeText={setName}
        style={$textField}
        autoCapitalize="none"
        label="Contact Name"
      />
      <TextInput
        value={_id}
        onChangeText={setId}
        style={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        label="Contact ID"
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