package services

import (
	"errors"
	"github.com/DLinkProjects/DLink/backend/entity"
	"github.com/DLinkProjects/DLink/backend/global"
	"github.com/DLinkProjects/DLink/backend/pkg/ssh"
	"strings"
)

type Server struct{}

func NewServer() *Server {
	return &Server{}
}

// CreateServer 添加服务器
func (s *Server) CreateServer(r entity.Server) error {
	result, err := global.Database.Exec("INSERT INTO nodes(parent_id, type, name) VALUES (?, ?, ?)", r.NodeID, "server", r.LinkName)
	if err != nil {
		return err
	}
	nodeId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	if _, err = global.Database.Exec("UPDATE nodes SET key = ? where id = ?", nodeId, nodeId); err != nil {
		return err
	}

	_, err = global.Database.Exec("INSERT INTO servers(host, port, username, password, node_id) VALUES (?, ?, ?, ?, ?)", r.Host, r.Port, r.Username, r.Password, nodeId)
	return err
}

// GetServers 获取服务器列表
func (s *Server) GetServers() (servers []*entity.Node, err error) {
	if err = global.Database.Select(&servers, "SELECT * FROM nodes"); err != nil {
		return nil, err
	}
	return
}

// CreateGroup 添加分组
func (s *Server) CreateGroup(r entity.Node) error {
	if strings.TrimSpace(r.Name) == "" {
		return errors.New("name cannot be empty")
	}
	result, err := global.Database.Exec("INSERT INTO nodes(parent_id, type, name) VALUES (?, ?, ?)", r.ParentID, r.Type, r.Name)
	if err != nil {
		return err
	}

	nodeId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	_, err = global.Database.Exec("UPDATE nodes SET key = ? where id = ?", nodeId, nodeId)
	return err
}

// GetGroups 获取分组列表
func (s *Server) GetGroups() (groups []*entity.Node, err error) {
	if err = global.Database.Select(&groups, "SELECT * FROM nodes WHERE type = 'group'"); err != nil {
		return nil, err
	}
	return
}

// GetServerCount 统计服务器总数量
func (s *Server) GetServerCount() (count uint, err error) {
	err = global.Database.Get(&count, "SELECT COUNT(*) FROM servers")
	return
}

// QueryServerByID 根据主键ID查询服务器信息
func (s *Server) QueryServerByID(id uint) (server *entity.Server, err error) {
	if err = global.Database.Select(&server, "SELECT * FROM servers WHERE id = ?", id); err != nil {
		return nil, err
	}
	return
}

// TestServerConnect 测试服务器连接
func (s *Server) TestServerConnect(r entity.Server) error {
	conf := &ssh.Config{
		AuthType: ssh.PassAuth,
		Host:     r.Host,
		Port:     r.Port,
		User:     r.Username,
		Password: r.Password,
		// PrivateKey:         r.PrivateKey,
		// PrivateKeyPassword: r.PrivateKeyPassword,
	}
	if r.PKeyID != 0 {
		// TODO: 查询密钥填充到 conf
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
