; LazyBooks | build/installer.nsh
; Custom NSIS hooks for the per-user installer (Phase 38).
; The uninstaller keeps the data folder (%APPDATA%\LazyBooks: vault, backups, config, logs)
; unless the person ticks Yes in the question below. Updates (isUpdated) and silent uninstalls never touch data.

!macro customUnInstall
  ${ifNot} ${isUpdated}
    ${ifNot} ${Silent}
      MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Also delete your LazyBooks data (synced books copy, backups, settings and logs)?$\r$\n$\r$\nChoose No to keep it, so a later reinstall continues where you left off." IDYES lbDeleteData IDNO lbKeepData
      lbDeleteData:
        RMDir /r "$APPDATA\LazyBooks"
      lbKeepData:
    ${endIf}
  ${endIf}
!macroend
