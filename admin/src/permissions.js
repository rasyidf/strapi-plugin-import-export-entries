export { pluginPermissions };

const pluginPermissions = {
  exportButton: [{ action: 'plugin::import-export-entries-zg.export', subject: null }],
  importButton: [{ action: 'plugin::import-export-entries-zg.import', subject: null }],
  main: [
    { action: 'plugin::import-export-entries-zg.export', subject: null },
    { action: 'plugin::import-export-entries-zg.import', subject: null },
  ],
};
