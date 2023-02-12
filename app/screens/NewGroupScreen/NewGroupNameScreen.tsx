import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../../navigators"
import { Screen, Text } from "../../components"
import { FAB, TextInput } from "react-native-paper"
import { spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"


export const NewGroupNameScreen: FC<StackScreenProps<ChatScreenProps<"NewGroupName">>> = observer(function NewGroupNameScreen() {
  // Pull in one of our MST stores
  const { newGroup: { name, setName, createChat } } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const onDone = ()=>{
    createChat().then(()=>{
      navigation.navigate("Chat")
    })
  }
  return (

    <>
      <Screen
        preset="auto"
        contentContainerStyle={$screenContentContainer}
        safeAreaEdges={["top", "bottom"]}
      >
        <TextInput
          value={name}
          onChangeText={setName}
          // style={$textField}
          autoCapitalize="none"
          label="Group Name"
        />

      </Screen>
      {
        name.length > 3 && <View style={$fixedView}>
          <FAB
            icon="check-bold"
            style={$fab}
            onPress={onDone}
          />
        </View>
      }

    </>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $fixedView: ViewStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
}
const $fab: ViewStyle = {
  margin: 40,
  right: 0,
  bottom: 0,
}