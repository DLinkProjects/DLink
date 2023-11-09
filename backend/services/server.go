package services

import (
	"errors"
	"github.com/DLinkProjects/DLink/backend/entity"
	"github.com/DLinkProjects/DLink/backend/global"
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

	_, err = global.Database.Exec("INSERT INTO servers(host, port, node_id) VALUES (?, ?, ?)", r.Host, r.Port, nodeId)
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

// QueryServerByNodeID 根据NodeID查询服务器信息
func (s *Server) QueryServerByNodeID(nodeId uint) (*entity.Server, error) {
	var server entity.Server
	if err := global.Database.Get(&server, "SELECT * FROM servers WHERE node_id = ?", nodeId); err != nil {
		return nil, err
	}
	return &server, nil
}
