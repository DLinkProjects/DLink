package base

import "runtime/debug"

// Version 在编译时使用 ldflags 覆盖版本信息
var Version = "Unknown"

func init() {
	if Version != "Unknown" {
		return
	}
	info, ok := debug.ReadBuildInfo()
	if ok {
		Version = info.Main.Version
	}
}
