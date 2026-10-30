const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// 这个应用只渲染简单页面。关掉 GPU 相关特性，避开部分显卡驱动 / 虚拟机环境下
// 的 GPU 进程崩溃（表现为窗口一闪就退出）。
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-software-rasterizer');
// GPU 进程在部分受限环境（虚拟机、无显卡驱动的机器）里起不来会导致窗口一闪就退，
// 改为进程内 GPU 更稳；这个应用渲染的是简单页面，性能足够。
app.commandLine.appendSwitch('in-process-gpu');

function createWindow() {
  const win = new BrowserWindow({
    width: 780,
    height: 920,
    minWidth: 420,
    minHeight: 560,
    title: '日迹 Daily Log',
    backgroundColor: '#f6f5f2',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon-256.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'index.html'));

  // 启动自检：页面真的渲染出来了才打印，方便排查白屏
  win.webContents.on('did-finish-load', () => {
    console.log('PAGE_LOADED: ' + win.getTitle());
  });
  win.webContents.on('did-fail-load', (e, code, desc) => {
    console.error('PAGE_FAIL: ' + code + ' ' + desc);
  });

  // 站外链接交给系统浏览器，不在应用内开新窗口
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
