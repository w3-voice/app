package bridge

type Identity struct {
	ID string `json:"_id"`
	Name string `json:"name"`
}

type Chat struct {
	ID string `json:"_id"`
	Name string `json:"name"`
	Members []string `json:"members"`
}

type Message struct {
	ID string `json:"_id"`
	ChatID string `json:"chatId"`
	Text string `json:"text"`
	CreatedAt int64 `json:"createdAt"`
	ContactID string `json:"user"`
	Sent bool `json:"sent"`
	Received bool `json:"received"`
	Pending bool `json:"pending"`
	Failed bool `json:"failed"`
}

type Contact struct {
	ID string `json:"_id"`
	Name string `json:"name"`
}
