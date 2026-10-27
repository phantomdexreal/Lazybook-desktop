# BA Mobile Connector 8.4.41 (desktop) - combined extraction

Source: BA_Mobile_Connector_Setup_8_4_41.exe -> NSIS -> app-64.7z -> resources/app.asar (fully unpacked).
Static reading only. Nothing was run and no server was contacted.

## Folders
- raw_from_installer/   The real project exactly as shipped, minus node_modules and the signing certificate.
    package.json, main.js (Electron main bundle), electron/background/background.bundle.js (hidden worker),
    dist/ (compiled Angular UI + assets), webpack/ configs, debug-desktop/, assets/, app-update.yml,
    native_unpacked/sqlite3 (native bindings), node_modules_manifest.txt (571 package@version lines).
- readable_split/       Every webpack module of the three bundles, one file each, pretty-printed.
    electron_main_process/ (2702 modules), background_worker/ (1641), angular_ui/ (1352).
    app_code vs vendor_libs is a keyword heuristic. Nothing is dropped, so check both folders.
    The whole Angular app is a single large module: angular_ui/app_code/module_zUnb.js.
- previous_extract_v1/  Your earlier ba_full_extract.zip, untouched (curated_tally_sync_modules/ etc.).
- README_SYNC_FLOW.md   Sync flow notes from the earlier extraction.

## Not included, on purpose
- certificate/SiliconVeinsComodoCodeSigning.pfx : the vendor's code-signing certificate. Not redistributed or used.
- node_modules (151 MB): third-party; reinstall from package.json / node_modules_manifest.txt.

## What this is and is not
- It is the shipped build: minified JS with mangled names. Strings, URLs, logic and structure are intact.
- It is not the original TypeScript/Angular source. That cannot be recovered from the installer
  (no source maps are shipped). Rebuilding the exact app is not possible, but the logic is fully readable.
- Stack for reference: Electron 7.1, webpack 4.41.5, Angular (AOT), sqlite3 4.1.1 + sequelize 5.18.2, aws-sdk, xml2js.
