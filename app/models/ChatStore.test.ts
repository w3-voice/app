import { ChatListModel } from "./ChatStore"

test("can be created", () => {
  const instance = ChatListModel.create({})

  expect(instance).toBeTruthy()
})
