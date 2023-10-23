package services

import (
	"github.com/DLinkProjects/DLink/backend/global"
	"github.com/DLinkProjects/DLink/backend/pkg/ssh"
	"github.com/DLinkProjects/DLink/backend/types"
	"strings"
)

type Server struct{}

func NewServer() *Server {
	return &Server{}
}

// CreateServer 添加服务器
func (s *Server) CreateServer(r types.CreateServerReq) error {
	result, err := global.Database.Exec(
		"INSERT INTO nodes(parent_id, type, name) VALUES (?, ?, ?)",
		r.ParentID, "server", r.LinkName,
	)
	if err != nil {
		return err
	}

	nodeId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	_, err = global.Database.Exec(
		"INSERT INTO servers(host, port, username, password, node_id) VALUES (?, ?, ?, ?, ?)",
		r.Host, r.Port, r.Username, r.Password, nodeId,
	)
	return err
}

// GetServerCount 统计服务器总数量
func (s *Server) GetServerCount() (count uint, err error) {
	err = global.Database.Get(&count, "SELECT COUNT(*) FROM servers")
	return
}

// TestServerConnect 测试服务器连接
func (s *Server) TestServerConnect(r types.CreateServerReq) error {
	conf := &ssh.Config{
		AuthType:           ssh.PassAuth,
		Host:               r.Host,
		Port:               r.Port,
		User:               r.Username,
		Password:           r.Password,
		PrivateKey:         r.PrivateKey,
		PrivateKeyPassword: r.PrivateKeyPassword,
	}
	// 如果连接密码为空则切换至私钥认证模式
	if strings.TrimSpace(r.Password) == "" {
		conf.AuthType = ssh.KeyAuth
	}
	if _, err := ssh.NewSSH(conf).Connect(); err != nil {
		return err
	}
	return nil
}
