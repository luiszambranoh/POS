const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  test: async (args) => {
    ipcRenderer.invoke('test', args);
  },
  updateQuery: async (query) => {
    try {
      const result = await ipcRenderer.invoke('update-query', query)

      console.log(result)
      return result;
    } catch (e) {
      throw new Error('Error updating query');
    }
  },
  askQuery: async (query) => {
    try {
      const result = await ipcRenderer.invoke('ask-query', query)
      return result;
    } catch (e) {
      console.error(e)
      throw new Error;
    }
  },
  getDolar: async () => {
    return await ipcRenderer.invoke('getDolar');
  },
});
