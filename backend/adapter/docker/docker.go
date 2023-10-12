package docker

import (
	"context"
	"errors"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"strings"
)

type Config struct {
	Host     string
	Port     uint
	Protocol string
	Context  context.Context
}

type Adapter struct {
	conf *Config
	ctx  context.Context
	cli  *client.Client
}

func New(conf *Config) *Adapter {
	return &Adapter{
		conf: conf,
		ctx:  conf.Context,
	}
}

func (a *Adapter) Connect() (*Adapter, error) {
	a.conf.Host = strings.TrimSpace(a.conf.Host)
	if a.conf.Protocol == "" {
		a.conf.Protocol = "tcp://"
	}
	if a.conf.Port == 0 {
		a.conf.Port = 2375
	}
	if a.conf.Host == "" {
		return nil, errors.New("not allowed empty host")
	}
	host := fmt.Sprintf("%s%s:%d", a.conf.Protocol, a.conf.Host, a.conf.Port)
	cli, err := client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, err
	}
	a.cli = cli
	return a, nil
}

// Info 获取服务器端基础信息
func (a *Adapter) Info() (*types.Info, error) {
	info, err := a.cli.Info(a.ctx)
	if err != nil {
		return nil, err
	}
	return &info, err
}

// ContainerList 拉取容器列表
func (a *Adapter) ContainerList() ([]types.Container, error) {
	containers, err := a.cli.ContainerList(a.ctx, types.ContainerListOptions{})
	if err != nil {
		return nil, err
	}
	return containers, nil
}

// ImageList 拉取镜像列表
func (a *Adapter) ImageList() ([]types.ImageSummary, error) {
	images, err := a.cli.ImageList(a.ctx, types.ImageListOptions{})
	if err != nil {
		return nil, err
	}
	return images, nil
}

// ContainerRestart 重启容器
func (a *Adapter) ContainerRestart(containerID string) error {
	if err := a.cli.ContainerRestart(a.ctx, containerID, container.StopOptions{}); err != nil {
		return err
	}
	return nil
}

// ContainerRemove 删除容器
func (a *Adapter) ContainerRemove(containerID string) error {
	if err := a.cli.ContainerRemove(a.ctx, containerID, types.ContainerRemoveOptions{}); err != nil {
		return err
	}
	return nil
}

// ContainerStop 停止容器
func (a *Adapter) ContainerStop(containerID string) error {
	if err := a.cli.ContainerStop(a.ctx, containerID, container.StopOptions{}); err != nil {
		return err
	}
	return nil
}

// ContainerStart 启动容器
func (a *Adapter) ContainerStart(containerID string) error {
	if err := a.cli.ContainerStart(a.ctx, containerID, types.ContainerStartOptions{}); err != nil {
		return err
	}
	return nil
}
