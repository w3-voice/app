import { ChatModel } from "./Chat"

test("can be created", () => {
  const instance = ChatModel.create({})

  expect(instance).toBeTruthy()
})
