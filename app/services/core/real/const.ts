
import {Event} from "./beeCore.type"

// messaging group 
const MESSAGING_GROUP = "Messaging"
// messaging names
const CHANGE_STATUS = "ChangeStatus"
const NEW_MESSAGE = "NewMessage"

export function MessageStatusFilter(evt: Event): boolean{
    return evt.group == MESSAGING_GROUP  && evt.name == CHANGE_STATUS
}

export function NewMessageFilter(evt: Event): boolean {
    return evt.group == MESSAGING_GROUP  && evt.name == NEW_MESSAGE
}