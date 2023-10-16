package main

import (
	"embed"
	"fmt"
	"github.com/DLinkProjects/DLink/backend"
	"github.com/DLinkProjects/DLink/backend/consts"
	"github.com/DLinkProjects/DLink/backend/services"
	"github.com/DLinkProjects/DLink/backend/utils/base"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"log"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	app := &backend.App{}
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
		OnStartup:        app.Startup,
		OnShutdown:       app.Shutdown,
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
			About: &mac.AboutInfo{
				Title:   fmt.Sprintf("%s %s", consts.ProjectName, base.Version),
				Message: "Copyright © 2023 DLinkProjects All rights reserved",
				Icon:    icon,
			},
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
		},
		Linux: &linux.Options{
			Icon:                icon,
			WebviewGpuPolicy:    linux.WebviewGpuPolicyOnDemand,
			WindowIsTranslucent: true,
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
