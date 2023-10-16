package backend

import (
	"context"
	"github.com/DLinkProjects/DLink/backend/global"
)

type App struct {
	ctx context.Context
}

// Startup 程序启动回调
func (b *App) Startup(ctx context.Context) {
	global.Register()
}

// Shutdown 程序关闭回调
func (b *App) Shutdown(ctx context.Context) {
	global.Unregister()
}
