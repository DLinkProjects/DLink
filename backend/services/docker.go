package services

import (
	"context"
	"github.com/DLinkProjects/DLink/backend/entity"
	"github.com/DLinkProjects/DLink/backend/pkg/docker"
	"strings"
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

func (d *Docker) Connect(nodeId uint) error {
	if d.DockerCLI != nil {
		d.DockerCLI.Close()
		d.DockerCLI = nil
	}

	server, err := d.ServerSrv.QueryServerByNodeID(nodeId)
	if err != nil {
		return err
	}

	// TODO: 后期需要支持自定义端口，从服务器信息查出来传入 docker.Config
	cli, err := docker.New(
		&docker.Config{
			Host:    server.Host,
			Context: context.Background(),
		},
	).Connect()
	if err != nil {
		return err
	}
	d.DockerCLI = cli
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

func (d *Docker) GetImageList() (images []*entity.Image, err error) {
	list, err := d.DockerCLI.ImageList()
	if err != nil {
		return nil, err
	}
	for _, v := range list {
		// TODO: 需要处理可能出现错误的情况
		repoTags := strings.Split(v.RepoTags[0], ":")
		id := strings.Split(v.ID, ":")
		images = append(images, &entity.Image{
			Name:    repoTags[0],
			ID:      id[1],
			Tag:     repoTags[1],
			Size:    v.Size,
			Created: v.Created,
		})
	}
	return
}
