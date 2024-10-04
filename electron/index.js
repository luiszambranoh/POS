const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
}

const db = require('sqlite3');
const fs = require("fs")

app.whenReady().then(() => {
  createWindow();

  const data = fs.readFileSync(path.join(__dirname, 'Query.sql')).toString();
  const database = new db.Database(path.join(__dirname, 'database.db'));
  database.exec(data)
});

ipcMain.handle('update-query', async (event, query) => {
  try {
    const database = new db.Database(path.join(__dirname, 'database.db'));
    await new Promise((resolve, reject) => {
      database.run(query, (err) => {
        if (err) {
          console.log(`Query executed: ${query}`);
          reject(err);
        } else {
          console.log(`Query executed: ${query}`);
          resolve(`Query executed: ${query}`);
        }
      });
    });
    database.close();
  } catch (e) {
    console.log(e)
    throw new Error(e);
  }
});

ipcMain.handle('ask-query', async (event, query) => {
  try {
    const database = new db.Database(path.join(__dirname, 'database.db'));
    const result = await new Promise((resolve, reject) => {
      database.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log(rows);
          resolve(rows);
        }
      });
    });
    database.close();
    return result;
  } catch (e) {
    console.log(e)
    throw new Error(e.message);
  }
});
