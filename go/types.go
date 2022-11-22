package bridge

import (
	"encoding/base64"
	"encoding/json"
)

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
	Text string `json:"text"`
	CreatedAt int64 `json:"createdAt"`
	ContactID string `json:"user"`
	Sent bool `json:"sent"`
	Received bool `json:"received"`
	Pending bool `json:"pending"`
}

type Contact struct {
	ID string `json:"_id"`
	Name string `json:"name"`
}

func Marshal(v any) (string, error) {
	bytes, err :=json.Marshal(v)
	if err != nil {
		return "" ,err
	}
	return base64.StdEncoding.EncodeToString(bytes), nil

}