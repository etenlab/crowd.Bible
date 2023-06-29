import { useEffect, useState } from 'react';
import packageJson from '../../package.json';
const appVersion = packageJson.version;

const semverGreaterThan = (versionA: string, versionB: string) => {
  const versionsA = versionA.split(/\./g);

  const versionsB = versionB.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());

    const b = Number(versionsB.shift());
    // eslint-disable-next-line no-continue
    if (a === b) continue;
    // eslint-disable-next-line no-restricted-globals
    return a > b || isNaN(b);
  }
  return false;
};

export const useCacheBuster = () => {
  const [state, setState] = useState<{
    loading: boolean;
    isLatestVersion: boolean;
  }>({
    loading: true,
    isLatestVersion: false,
  });

  const refreshCacheAndReload = () => {
    console.log('Clearing cache and hard reloading...');
    if (caches) {
      // Service worker cache should be cleared with caches.delete()
      caches.keys().then(function (names) {
        for (const name of names) caches.delete(name);
      });
    }
    localStorage.clear();
    console.log('window.indexedDB.databases()', window.indexedDB.databases());
    // delete browser cache and hard reload
    window.location.reload();
  };

  useEffect(() => {
    fetch('/meta.json')
      .then((response) => response.json())
      .then((meta) => {
        const latestVersion = meta.version;
        const currentVersion = appVersion;

        const shouldForceRefresh = semverGreaterThan(
          latestVersion,
          currentVersion,
        );
        if (shouldForceRefresh) {
          console.log(
            `We have a new version - ${latestVersion}. Should force refresh`,
          );
          setState({ loading: false, isLatestVersion: false });
        } else {
          console.log(
            `You already have the latest version - ${latestVersion}. No cache refresh needed.`,
          );
          setState({ loading: false, isLatestVersion: true });
        }
      });
  });
  return {
    loading: state.loading,
    isLatestVersion: state.isLatestVersion,
    refreshCacheAndReload,
  };
};
