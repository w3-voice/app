import { StyleProp, ViewStyle } from 'react-native'
import { LightboxProps } from 'react-native-lightbox-v2'
import { Contact, GiftedMessage } from '../../models'

export { ActionsProps } from 'react-native-gifted-chat/lib/Actions'
export { AvatarProps } from 'react-native-gifted-chat/lib/Avatar'
export {
  BubbleProps,
  RenderMessageImageProps,
  RenderMessageVideoProps,
  RenderMessageAudioProps,
  RenderMessageTextProps,
} from './Bubble'
export { ComposerProps } from 'react-native-gifted-chat/lib/Composer'
export { DayProps } from 'react-native-gifted-chat/lib/Day'
export { GiftedAvatarProps } from 'react-native-gifted-chat/lib/GiftedAvatar'
export { InputToolbarProps } from 'react-native-gifted-chat/lib/InputToolbar'
export { LoadEarlierProps } from 'react-native-gifted-chat/lib/LoadEarlier'
export { MessageProps } from 'react-native-gifted-chat/lib/Message'
export { MessageContainerProps } from 'react-native-gifted-chat/lib/MessageContainer'
export { MessageImageProps } from 'react-native-gifted-chat/lib/MessageImage'
export { MessageTextProps } from 'react-native-gifted-chat/lib/MessageText'
export { QuickRepliesProps } from 'react-native-gifted-chat/lib/QuickReplies'
export { SendProps } from 'react-native-gifted-chat/lib/Send'
export { SystemMessageProps } from 'react-native-gifted-chat/lib/SystemMessage'
export { TimeProps } from 'react-native-gifted-chat/lib/Time'

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export interface LeftRightStyle<T> {
  left?: StyleProp<T>
  right?: StyleProp<T>
}
type renderFunction = (x: any) => JSX.Element
export interface User {
  _id: string | number
  name?: string
  avatar?: string | number | renderFunction
}

export interface Reply {
  title: string
  value: string
  messageId?: any
}

export interface QuickReplies {
  type: 'radio' | 'checkbox'
  values: Reply[]
  keepIt?: boolean
}

export type IMessage = GiftedMessage

export type IChatMessage = IMessage

export interface MessageVideoProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  videoStyle?: StyleProp<ViewStyle>
  videoProps?: object
  lightboxProps?: LightboxProps
}

export interface MessageAudioProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  audioStyle?: StyleProp<ViewStyle>
  audioProps?: object
}
