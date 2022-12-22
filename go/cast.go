package bridge

import (
	"encoding/base64"
	"encoding/json"

	"github.com/hood-chat/core/entity"
)

type BridgeSerializer interface {
	Serialize() (string, error)
}
type BridgeCast[C any] interface {
	cast() C
}

type BMessage entity.Message

func (m *BMessage) Serialize() (string, error) {
	return Marshal(m.cast())
}

func (m *BMessage) cast() Message {
	return Message{
		ID:        m.ID.String(),
		Text:      m.Text,
		ChatID:    string(m.ChatID),
		CreatedAt: m.CreatedAt * 1000,
		ContactID: m.Author.ID.String(),
		Sent:      m.Status == entity.Sent,
		Received:  m.Status == entity.Seen,
		Pending:   m.Status == entity.Pending,
		Failed:    m.Status == entity.Failed,
	}
}

type BMessages []entity.Message

func (m BMessages) Serialize() (string, error) {
	res := make([]Message, 0)
	for _, msg := range m {
		m := BMessage(msg)
		res = append(res, m.cast())
	}
	return Marshal(res)
}

type BContact entity.Contact

func (m *BContact) Serialize() (string, error) {
	return Marshal(m.cast())
}

func (m *BContact) cast() Contact {
	return Contact{m.ID.String(), m.Name}
}

type BContacts []entity.Contact

func (m BContacts) Serialize() (string, error) {
	res := make([]Contact, 0)
	for _, msg := range m {
		m := BContact(msg)
		res = append(res, m.cast())
	}
	return Marshal(res)
}

type BChat entity.ChatInfo

func (m *BChat) Serialize() (string, error) {
	return Marshal(m.cast())
}

func (m *BChat) cast() Chat {
	mids := []string{}
	for _, m := range m.Members {
		mids = append(mids, m.ID.String())
	}
	return Chat{
		ID:      m.ID.String(),
		Name:    m.Name,
		Members: mids,
	}
}

type BChats []entity.ChatInfo

func (m BChats) Serialize() (string, error) {
	res := make([]Chat, 0)
	for _, msg := range m {
		m := BChat(msg)
		res = append(res, m.cast())
	}
	return Marshal(res)
}

type BIdentity entity.Identity

func (m *BIdentity) Serialize() (string, error) {
	return Marshal(m.cast())
}

func (m *BIdentity) cast() Identity {
	return Identity{m.ID.String(), m.Name}
}


// type BSlice[C any] []BridgeCast[C]

// func (m *BSlice[C]) Serialize() (string, error) {
// 	res := make([]C, 0)
// 	for _, msg := range *m {
// 		res = append(res, msg.cast())
// 	}
// 	return Marshal(res)
// 	return "", nil
// }

func Marshal(v any) (string, error) {
	bytes, err := json.Marshal(v)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(bytes), nil

}
