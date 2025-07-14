/**
 * Get proxy configuration from environment variables
 */
export function getProxyConfig() {
  const domain = process.env.PROXY_DOMAIN ?? 'localhost';
  const insecureProxy = process.env.PROXY_INSECURE;
  const proxyProtocol = insecureProxy === 'true' ? 'http' : 'https';
  const baseUrl = `${proxyProtocol}://${domain}`;
  const referrer = insecureProxy ? baseUrl : `${baseUrl}`; // change to ${baseUrl}:443 if you get 403

  return {
    baseUrl,
    domain,
    host: domain,
    insecureProxy: insecureProxy === 'true',
    proxyProtocol,
    referrer,
    target: `${baseUrl}/webapi`,
  };
}

/**
 * Get the backend API URL for server-side requests
 */
export function getBackendUrl(path: string): string {
  const { baseUrl } = getProxyConfig();
  return `${baseUrl}${path}`;
}
