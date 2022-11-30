const WebBasedAdapter = require('../web-based');
const WebDAVInterface = require('./interface');

class WebDAVAdapter extends WebBasedAdapter {
  /**
   * @param {FileSystemAdapterOptions & {rootName: string?, apiURL: string?, updatePermissions: boolean?, disclaimer?: string, restricted?: boolean}} options
   */
  constructor(options) {
    super(options);
    this.name = this.name || 'Data Server';
    this.apiURL = options?.apiURL;
    this.rootName = options?.rootName;
    this.storages = [];
    this.ignoreCertificateErrors = options?.ignoreCertificateErrors;
    this.updatePermissions = options?.updatePermissions;
    this.disclaimer = options?.disclaimer;
    this.restricted = options?.restricted;
  }

  toString() {
    return [
      `Adapter ${this.type}:`,
      `  url:                        ${this.url}`,
      `  user:                       ${this.user}`,
      `  password:                   ${this.password ? '***' : '<empty>'}`,
      `  api (for storage fetching): ${this.apiURL}`,
      `  ignore cert errors:         ${!!this.ignoreCertificateErrors}`,
      `  update permissions:         ${!!this.updatePermissions}`,
    ].join('\n');
  }

  async createInterface() {
    const webDAVInterface = new WebDAVInterface(this);
    await webDAVInterface.initialize({
      name: this.name,
      url: this.url,
      user: this.user,
      password: this.password,
      rootName: this.rootName,
      storages: this.storages,
      apiURL: this.apiURL,
      ignoreCertificateErrors: this.ignoreCertificateErrors,
      updatePermissions: this.updatePermissions,
      disclaimer: this.disclaimer,
    });
    return webDAVInterface;
  }

  /**
   * @param {WebDAVInterface} fsInterface
   * @returns {Promise<void>}
   */
  async destroyInterface(fsInterface) {
    if (fsInterface && fsInterface.storages) {
      this.storages = fsInterface.storages.slice();
    }
    await super.destroyInterface(fsInterface);
  }

  async useLastRequestOnlySession(sessionName, fn) {
    return this.useSession(fn);
  }
}

module.exports = WebDAVAdapter;
