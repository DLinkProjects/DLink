package entity

import "github.com/DLinkProjects/DLink/backend/enum"

type Preferences struct {
	Theme           enum.AppTheme    `db:"theme"`
	Language        enum.AppLanguage `db:"language"`
	AutoCheckUpdate bool             `db:"auto_check_update"`
}
