package ssh

import (
	"errors"
	"fmt"
	"golang.org/x/crypto/ssh"
	"net"
	"time"
)

type AuthTypeSSH = int

const (
	PassAuth AuthTypeSSH = iota
	KeyAuth
)

type Config struct {
	AuthType           AuthTypeSSH
	Port               uint
	Host               string
	User               string
	Password           string
	PrivateKey         string
	PrivateKeyPassword string
}

type Adapter struct {
	conf   *Config
	Client *ssh.Client
}

func New(conf *Config) *Adapter {
	return &Adapter{
		conf: conf,
	}
}

func (a *Adapter) Connect() (*Adapter, error) {
	var auth []ssh.AuthMethod

	switch a.conf.AuthType {
	case PassAuth:
		auth = append(auth, ssh.Password(a.conf.Password))
	case KeyAuth:
		signer, err := a.signer()
		if err != nil {
			return a, err
		}
		auth = append(auth, ssh.PublicKeys(signer))
	default:
		return a, errors.New("invalid authentication type provided")
	}

	config := &ssh.ClientConfig{
		User:    a.conf.User,
		Auth:    auth,
		Timeout: 10 * time.Second,
		HostKeyCallback: func(hostname string, remote net.Addr, key ssh.PublicKey) error {
			return nil
		},
	}

	client, err := ssh.Dial("tcp", fmt.Sprintf("%s:%d", a.conf.Host, a.conf.Port), config)
	if err != nil {
		return a, err
	}

	a.Client = client
	return a, nil
}

func (a *Adapter) signer() (ssh.Signer, error) {
	if a.conf.PrivateKeyPassword == "" {
		return ssh.ParsePrivateKey([]byte(a.conf.PrivateKey))
	} else {
		return ssh.ParsePrivateKeyWithPassphrase([]byte(a.conf.PrivateKey), []byte(a.conf.PrivateKeyPassword))
	}
}

func (a *Adapter) Close() {
	if a.Client != nil {
		_ = a.Client.Close()
		a.Client = nil
	}
}
