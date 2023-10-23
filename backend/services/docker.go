package services

import (
	"context"
	"github.com/DLinkProjects/DLink/backend/entity"
	"github.com/DLinkProjects/DLink/backend/pkg/docker"
)

type Docker struct {
	ServerSrv *Server
	DockerCLI *docker.Adapter
}

func NewDocker(serverSrv *Server) *Docker {
	return &Docker{
		ServerSrv: serverSrv,
	}
}

func (d *Docker) Connect(serverId uint) error {
	if d.DockerCLI != nil {
		d.DockerCLI.Close()
		d.DockerCLI = nil
	}

	server, err := d.ServerSrv.QueryServerByID(serverId)
	if err != nil {
		return err
	}

	// TODO: 后期需要支持自定义端口，从服务器信息查出来传入 docker.Config
	dockerCLI, err := docker.New(
		&docker.Config{
			Host:    server.Host,
			Context: context.Background(),
		},
	).Connect()
	if err != nil {
		return err
	}
	d.DockerCLI = dockerCLI
	return nil
}

func (d *Docker) GetContainerList() (containers []*entity.Container, err error) {
	list, err := d.DockerCLI.ContainerList()
	if err != nil {
		return nil, err
	}
	for _, v := range list {
		containers = append(containers, &entity.Container{
			Name:    v.Names[0],
			ID:      v.ID,
			Image:   v.Image,
			State:   v.State,
			Status:  v.Status,
			Created: v.Created,
		})
	}
	return
}
