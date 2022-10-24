import { ChatListModel } from "./ChatList"

test("can be created", () => {
  const instance = ChatListModel.create({})

  expect(instance).toBeTruthy()
})
