import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen } from "../components"
import { Button, Card, Text } from "react-native-paper"
import { spacing } from "../theme/spacing"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Permission: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Permission" component={PermissionScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const PermissionScreen: FC<StackScreenProps<AppStackScreenProps, "Permission">> = observer(function PermissionScreen() {
  // Pull in one of our MST stores
  const { permissionStore: { supported, openAppInfo, powersave, autostart, optimization, requestDisablePowerSaving, requestEnableAutoStart, doneAsking, openBatteryOptimization } } = useStores()
  useEffect(() => {
    !powersave && !autostart && doneAsking()
  }, [powersave, autostart])

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="fixed">
      <View style={$topSection}>
        <Text variant="headlineMedium" style={$header}>Permission</Text>
      </View>
      {supported && !optimization &&
        <View>
          {powersave &&
            <Card style={$cards}>
              <Card.Content>
                <Text variant="bodyLarge">let me run in background and handle your messages</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => { requestDisablePowerSaving() }}>Fix</Button>
              </Card.Actions>
            </Card>
          }
          {autostart &&
            <Card>
              <Card.Content>
                <Text variant="bodyLarge">Let me start on boot</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => { requestEnableAutoStart() }}>Fix</Button>
              </Card.Actions>
            </Card>
          }
        </View>
      }
      {optimization &&
        <View>
          <Card>
            <Card.Content>
              <Text variant="bodyLarge">disable battery optimization</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => { openBatteryOptimization() }}>Fix</Button>
            </Card.Actions>
          </Card>
        </View>
      }
      {!supported && !optimization &&
        (<View>
          <Card style={$cards}>
            <Card.Content>
              <Text variant="bodyLarge"> You need to enable autostart and disable battery power save manually </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => { openAppInfo() }}>Fix</Button>
            </Card.Actions>
          </Card>
        </View>)
      }

    </Screen>
  )
})

const $root: ViewStyle = {
  paddingVertical: spacing.large,
  paddingHorizontal: spacing.extraSmall,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

const $topSection: ViewStyle = {

}

const $header: TextStyle = {
  textAlign: "center",
  paddingVertical: spacing.huge,
}

const $cards: ViewStyle = {
  marginVertical: spacing.large,
}