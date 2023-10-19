package services

import (
	"github.com/DLinkProjects/DLink/backend/global"
	"github.com/DLinkProjects/DLink/backend/types"
)

type Server struct{}

func NewServer() *Server {
	return &Server{}
}

// CreateServer 添加服务器
//
//goland:noinspection SqlNoDataSourceInspection
func (s *Server) CreateServer(data types.CreateServerReq) error {
	result, err := global.Database.Exec(
		"INSERT INTO nodes(parent_id, type, name) VALUES (?, ?, ?)",
		data.ParentID, "server", data.LinkName,
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
		data.Host, data.Port, data.Username, data.Password, nodeId,
	)
	return err
}

// GetServerCount 统计服务器总数量
//
//goland:noinspection SqlNoDataSourceInspection
func (s *Server) GetServerCount() (count uint, err error) {
	err = global.Database.Get(&count, "SELECT COUNT(*) FROM servers")
	return
}
