package enum

type AppTheme uint

const (
	AutoTheme AppTheme = iota
	DarkTheme
	LightTheme
)

type AppLanguage uint

const (
	AutoLanguage AppLanguage = iota
	ChineseLanguage
	EnglishLanguage
)
