package services

import (
	"errors"
	"github.com/DLinkProjects/DLink/backend/entity"
	"github.com/DLinkProjects/DLink/backend/global"
	"github.com/DLinkProjects/DLink/backend/types"
)

type Server struct{}

func NewServer() *Server {
	return &Server{}
}

// CreateServer 添加服务器
func (s *Server) CreateServer(r types.CreateServerReq) error {
	result, err := global.Database.Exec(
		"INSERT INTO nodes(parent_id, type, name) VALUES (?, ?, ?)",
		r.NodeID, "server", r.LinkName,
	)
	if err != nil {
		return err
	}
	nodeId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	_, err = global.Database.Exec(
		"UPDATE nodes SET key = ? where id = ?", nodeId, nodeId,
	)

	if err != nil {
		return err
	}

	_, err = global.Database.Exec(
		"INSERT INTO servers(host, port, username, password, node_id) VALUES (?, ?, ?, ?, ?)",
		r.Host, r.Port, r.Username, r.Password, nodeId,
	)
	return err
}

// GetServers 获取服务器列表
func (s *Server) GetServers() (types.ServersResp, error) {
	var nodes []entity.Node
	sqlStr := "SELECT * FROM nodes"
	if err := global.Database.Select(&nodes, sqlStr); err != nil {
		return types.ServersResp{}, err
	}
	return types.ServersResp{Nodes: nodes}, nil
}

// CreateGroups 添加分组
func (s *Server) CreateGroups(data types.GroupReq) error {
	sqlStr := "INSERT INTO nodes(parent_id, type, name) VALUES (?, ?, ?)"
	if data.Name == "" {
		return errors.New("name cannot be empty")
	}
	result, err := global.Database.Exec(sqlStr, data.ParentID, data.Type, data.Name)
	if err != nil {
		return err
	}

	nodeId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	_, err = global.Database.Exec(
		"UPDATE nodes SET key = ? where id = ?", nodeId, nodeId,
	)
	return err
}

// GetGroups 获取分组列表
func (s *Server) GetGroups() (types.GroupsResp, error) {
	var groups []entity.Node
	sqlStr := "SELECT * FROM nodes WHERE type = 'group'"
	if err := global.Database.Select(&groups, sqlStr); err != nil {
		return types.GroupsResp{}, err
	}
	return types.GroupsResp{Groups: groups}, nil
}

// GetServerCount 统计服务器总数量
func (s *Server) GetServerCount() (count uint, err error) {
	sqlStr := "SELECT COUNT(*) FROM servers"
	err = global.Database.Get(&count, sqlStr)
	return
}
