package bridge

import (
	"context"
	"strings"

	"github.com/hood-chat/core"
	"github.com/hood-chat/core/entity"
	"github.com/hood-chat/core/event"
	logging "github.com/ipfs/go-log/v2"
	ma "github.com/multiformats/go-multiaddr"
	madns "github.com/multiformats/go-multiaddr-dns"
	manet "github.com/multiformats/go-multiaddr/net"
)

var log = logging.Logger("bridge")

type Bridge struct {
	core core.Messenger
}

func NewBridge(repoPath string, conf *HostConfig) (*Bridge, error) {
	if conf.emitter != nil {
		SetEmitter(conf.emitter)
	}
	hb := NewMobileHost(conf)
	if hb == nil {
		panic("new hb failed")
	}

	m := core.MessengerBuilder(repoPath, Option(), hb)

	f := &Bridge{m}
	sub, err := m.EventBus().Subscribe(new(event.EvtObject))
	if err != nil {
		panic("can not subscribe to bus")
	}
	go func() {
		defer sub.Close()

		for e := range sub.Out() {
			evt := Event(e.(event.EvtObject))
			getEmitter().Emit(&evt)
		}
	}()

	return f, nil
}

func (b *Bridge) IsLogin() bool {
	return b.core.IsLogin()
}

func (b *Bridge) GetInterfaces() (string, error) {
	adders, err := manet.InterfaceMultiaddrs()
	if err != nil {
		panic("manet not work")
	}
	addr, err := ma.NewMultiaddr("/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN")
	if err != nil {
		panic("cant parse ma adder")
	}
	_, err = madns.Resolve(context.Background(), addr)
	if err != nil {
		log.Debugf("can not resolve host: %s", err.Error())
		// panic("madns not work")
	}
	sAdders := make([]string, 0)
	for _, val := range adders {
		sAdders = append(sAdders, val.String())
	}
	return strings.Join(sAdders, " , "), err

}

func (b *Bridge) GetIdentity() (string, error) {
	idn, err := b.core.GetIdentity()
	if err != nil {
		return "", err
	}
	i := BIdentity(idn)
	return i.Serialize()
}

func (b *Bridge) NewIdentity(name string) (string, error) {
	idn, err := b.core.SignUp(name)
	if err != nil {
		return "", err
	}
	i := BIdentity(*idn)
	return i.Serialize()
}

func (b *Bridge) GetChat(id string) (string, error) {
	chatId := entity.ID(id)
	msgr := b.core
	ch, err := msgr.GetChat(chatId)
	if err != nil {
		return "", err
	}
	c := BChat(ch)
	return c.Serialize()
}

func (b *Bridge) GetChats() (string, error) {
	msgr := b.core
	ch, err := msgr.GetChats()
	if err != nil {
		return "", err
	}
	res := BChats(ch)
	return res.Serialize()
}

func (b *Bridge) GetMessages(chatID string) (string, error) {
	id := entity.ID(chatID)
	msgr := b.core
	msgs, err := msgr.GetMessages(id)
	if err != nil {
		return "", err
	}
	res := BMessages(msgs)
	return res.Serialize()
}

func (b *Bridge) GetMessage(ID string) (string, error) {
	id := entity.ID(ID)
	msgr := b.core
	msg, err := msgr.GetMessage(id)
	if err != nil {
		return "", err
	}
	bmsg := BMessage(msg)
	return bmsg.Serialize()
}

func (b *Bridge) SendMessage(chatId string, text string) (string, error) {
	msgr := b.core
	msg, err := msgr.SendPM(entity.ID(chatId), text)
	if err != nil {
		return "", err
	}
	bmsg := BMessage(*msg)
	return bmsg.Serialize()
}

func (b *Bridge) GetContacts() (string, error) {
	msgr := b.core
	cs, err := msgr.GetContacts()
	if err != nil {
		return "", err
	}
	res := BContacts(cs)
	return res.Serialize()
}

func (b *Bridge) GetContact(id string) (string, error) {
	contactID := entity.ID(id)
	msgr := b.core
	c, err := msgr.GetContact(contactID)
	if err != nil {
		return "", err
	}
	res := BContact(c)
	return res.Serialize()
}

func (b *Bridge) AddContact(id string, name string) error {
	msgr := b.core
	err := msgr.AddContact(entity.Contact{
		ID:   entity.ID(id),
		Name: name,
	})
	return err
}

func (b Bridge) NewPMChat(contactID string) (string, error) {
	id := entity.ID(contactID)
	msgr := b.core
	pm, err := msgr.CreatePMChat(id)
	if err != nil {
		return "", err
	}
	res := BChat(pm)
	return res.Serialize()
}

func (b Bridge) GetPMChat(contactID string) (string, error) {
	id := entity.ID(contactID)
	msgr := b.core
	pm, err := msgr.GetPMChat(id)
	if err != nil {
		return "", err
	}
	res := BChat(pm)
	return res.Serialize()
}
