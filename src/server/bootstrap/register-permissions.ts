export { registerPermissionActions };

async function registerPermissionActions() {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Import',
      uid: 'import',
      pluginName: 'import-export-entries-zg',
    },
    {
      section: 'plugins',
      displayName: 'Export',
      uid: 'export',
      pluginName: 'import-export-entries-zg',
    },
  ];

  await (strapi as any).admin.services.permission.actionProvider.registerMany(actions);
}
