import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle, Keyboard } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text, TextField, } from "../components"
import { colors, spacing } from "../theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { Button, TextInput } from "react-native-paper"

export const CreateIdentityScreen: FC<StackScreenProps<AppStackScreenProps<"CreateIdentity">>> = observer(function CreateIdentityScreen() {
  // Pull in one of our MST stores
  const { identityStore: {newIdentity, form, setForm} } = useStores()
  const [creating, setCreating] = useState(false)

  // Pull in navigation via hook
  const navigation = useNavigation()
  const handleNewIdentity = () => {
    if(!creating){
      setCreating(true);
      Keyboard.dismiss()
      newIdentity(form).then(()=>{
        setCreating(false)
        navigation.navigate("ChatList")
      })
    }
  }

  const onTextChange = (s: string)=>{
    if(!creating){
      setForm(s)
    }
  }

  return (
    <Screen 
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text tx="createIdentity.message" />

      <TextInput
        value={form}
        onChangeText={onTextChange}
        editable={!creating}
        autoCapitalize="none"
        autoCorrect={false}
        label="Please pick a name"
        style={$textField}
        // helper="Field can not be empty"
      />

      <Button
        mode="contained"
        loading={creating}
        disabled={form.length<1}
        onPress={handleNewIdentity}
      >
        Join
      </Button>
      {creating &&<Text text="It may take a minute" />}
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
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
  // display: 'none',
  marginTop: spacing.extraSmall,
}