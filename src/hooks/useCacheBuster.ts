import { useEffect, useState, useCallback } from 'react';
import { LoggerService } from '@eten-lab/core';

import localforage from 'localforage';
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

const logger = new LoggerService();

export const useCacheBuster = () => {
  const [state, setState] = useState<{
    loading: boolean;
    isLatestVersion: boolean;
  }>({
    loading: true,
    isLatestVersion: false,
  });

  const refreshCacheAndReload = useCallback(async () => {
    try {
      if (caches) {
        // Service worker cache should be cleared with caches.delete()
        caches.keys().then(function (names) {
          for (const name of names) caches.delete(name);
        });
      }
      localStorage.clear();
      localforage.setDriver(localforage.INDEXEDDB);
      await localforage.clear();
      window.location.reload();
    } catch (err) {
      logger.error(err);
    }
  }, []);

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
          console.info(
            'info:::: ',
            `We have a new version - ${latestVersion}. Should force refresh`,
          );
          logger.error(
            `We have a new version - ${latestVersion}. Should force refresh`,
          );
          setState({ loading: false, isLatestVersion: false });
        } else {
          console.info(
            'info:::: ',
            `You already have the latest version - ${latestVersion}. No cache refresh needed.`,
          );
          logger.error(
            `You already have the latest version - ${latestVersion}. No cache refresh needed.`,
          );
          setState({ loading: false, isLatestVersion: true });
        }
      });
  }, []);
  return {
    loading: state.loading,
    isLatestVersion: state.isLatestVersion,
    refreshCacheAndReload,
  };
};
