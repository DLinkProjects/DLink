package main

import (
	"embed"
	"runtime"

	"github.com/DLinkProjects/DLink/backend/consts"
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
	// Create an instance of the app structure
	app := NewApp()
	preference := services.NewPreferences()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "DLink",
		Width:     consts.DefaultWindowWidth,
		Height:    consts.DefaultWindowHeight,
		MinWidth:  consts.DefaultWindowWidth,
		MinHeight: consts.DefaultWindowHeight,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 0},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			preference,
		},
		Frameless: runtime.GOOS != "darwin",
		// windows specific options
		Windows: &windows.Options{
			WebviewIsTransparent:              true,
			WindowIsTranslucent:               true,
			DisableFramelessWindowDecorations: true,
		},
		// MacOS specific options
		Mac: &mac.Options{
			TitleBar: mac.TitleBarHiddenInset(),
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
