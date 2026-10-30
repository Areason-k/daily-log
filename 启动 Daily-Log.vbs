' ============================================================
'  Daily-Log launcher
'  Opens the app in Edge/Chrome "app mode": no address bar,
'  no tabs, own window and taskbar entry - looks like a desktop app.
'  Double-click this file, or right-click -> Send to -> Desktop
'  (create shortcut) to put it on your desktop.
' ============================================================
Option Explicit

Dim fso, ws, base, url, edge, chrome, pf, pf86
Set fso = CreateObject("Scripting.FileSystemObject")
Set ws  = CreateObject("WScript.Shell")

pf   = ws.ExpandEnvironmentStrings("%ProgramFiles%")
pf86 = ws.ExpandEnvironmentStrings("%ProgramFiles(x86)%")

' Locate index.html next to this script
base = fso.GetParentFolderName(WScript.ScriptFullName)
url  = "file:///" & Replace(base, "\", "/") & "/index.html"

edge = pf86 & "\Microsoft\Edge\Application\msedge.exe"
If Not fso.FileExists(edge) Then edge = pf & "\Microsoft\Edge\Application\msedge.exe"

chrome = pf & "\Google\Chrome\Application\chrome.exe"
If Not fso.FileExists(chrome) Then chrome = pf86 & "\Google\Chrome\Application\chrome.exe"

If fso.FileExists(edge) Then
    ws.Run """" & edge & """ --app=""" & url & """", 1, False
ElseIf fso.FileExists(chrome) Then
    ws.Run """" & chrome & """ --app=""" & url & """", 1, False
Else
    ' No Chromium browser found - fall back to the default browser
    ws.Run """" & url & """", 1, False
End If
