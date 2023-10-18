package ssh

import (
	"errors"
	"fmt"
	"golang.org/x/crypto/ssh"
	"net"
	"strings"
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

type SecureShell struct {
	conf   *Config
	client *ssh.Client
}

type SecureShellExec struct {
	output string
	err    error
}

func NewSSH(conf *Config) *SecureShell {
	return &SecureShell{
		conf: conf,
	}
}

func (s *SecureShell) Connect() (*SecureShell, error) {
	var auth []ssh.AuthMethod

	switch s.conf.AuthType {
	case PassAuth:
		auth = append(auth, ssh.Password(s.conf.Password))
	case KeyAuth:
		signer, err := s.signer()
		if err != nil {
			return s, err
		}
		auth = append(auth, ssh.PublicKeys(signer))
	default:
		return s, errors.New("invalid authentication type provided")
	}

	config := &ssh.ClientConfig{
		User:    s.conf.User,
		Auth:    auth,
		Timeout: 10 * time.Second,
		HostKeyCallback: func(hostname string, remote net.Addr, key ssh.PublicKey) error {
			return nil
		},
	}

	client, err := ssh.Dial("tcp", fmt.Sprintf("%s:%d", s.conf.Host, s.conf.Port), config)
	if err != nil {
		return s, err
	}

	s.client = client
	return s, nil
}

func (s *SecureShell) signer() (ssh.Signer, error) {
	if s.conf.PrivateKeyPassword == "" {
		return ssh.ParsePrivateKey([]byte(s.conf.PrivateKey))
	} else {
		return ssh.ParsePrivateKeyWithPassphrase([]byte(s.conf.PrivateKey), []byte(s.conf.PrivateKeyPassword))
	}
}

func (s *SecureShell) Close() {
	if s.client != nil {
		_ = s.client.Close()
		s.client = nil
	}
}

func (s *SecureShell) Run(cmd string) *SecureShellExec {
	session, err := s.client.NewSession()
	if err != nil {
		return &SecureShellExec{
			output: "",
			err:    err,
		}
	}
	defer func() {
		_ = session.Close()
	}()
	buf, err := session.CombinedOutput(cmd)
	return &SecureShellExec{
		output: string(buf),
		err:    err,
	}
}

func (s *SecureShellExec) Raw() (string, error) {
	return s.output, s.err
}

func (s *SecureShellExec) Unwrap() string {
	if s.err != nil {
		return ""
	}
	s.output = strings.Trim(s.output, "\n")
	s.output = strings.TrimSpace(s.output)
	return s.output
}
