package main

import (
	"context"
	"embed"
	"github.com/DLinkProjects/DLink/backend/consts"
	"github.com/DLinkProjects/DLink/backend/global"
	"github.com/DLinkProjects/DLink/backend/services"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	global.Register()
	defer global.Unregister()

	preference := services.NewPreferences()

	err := wails.Run(&options.App{
		Title:     consts.ProjectName,
		Width:     consts.DefaultWindowWidth,
		Height:    consts.DefaultWindowHeight,
		MinWidth:  consts.DefaultWindowWidth,
		MinHeight: consts.DefaultWindowHeight,
		Frameless: preference.GetSysVersion() != "darwin",
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 0},
		OnStartup: func(ctx context.Context) {
		},
		Bind: []any{
			preference,
		},
		Windows: &windows.Options{
			WebviewIsTransparent:              true,
			WindowIsTranslucent:               true,
			DisableFramelessWindowDecorations: true,
		},
		Mac: &mac.Options{
			TitleBar: mac.TitleBarHiddenInset(),
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
