import { useState, useCallback } from 'react';

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToast,
} from '@ionic/react';

import { Button, MuiMaterial } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { FeedbackTypes, LoadingStatuses } from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

const { Stack } = MuiMaterial;

export function SyncPage() {
  const {
    states: {
      global: { singletons },
    },
    actions: { createLoadingStack, alertFeedback },
    logger,
  } = useAppContext();
  const { tr } = useTr();

  const [syncInLoadingStatus, setSyncInLoadingStatus] =
    useState<LoadingStatuses>(LoadingStatuses.INITIAL);
  const [syncOutLoadingStatus, setSyncOutLoadingStatus] =
    useState<LoadingStatuses>(LoadingStatuses.INITIAL);
  const [syncInViaJsonLoadingStatus, setSyncInViaJsonLoadingStatus] =
    useState<LoadingStatuses>(LoadingStatuses.INITIAL);
  const [syncOutViaJsonLoadingStatus, setSyncOutViaJsonLoadingStatus] =
    useState<LoadingStatuses>(LoadingStatuses.INITIAL);
  const [downloadDBJsonLoadingStatus, setDownloadDBJsonLoadingStatus] =
    useState<LoadingStatuses>(LoadingStatuses.INITIAL);
  const [syncInViaJsonFileLoadingStatus, setSyncInViaJsonFileLoadingStatus] =
    useState<LoadingStatuses>(LoadingStatuses.INITIAL);

  const [loadResult, setLoadResult] = useState('');

  const doSyncOut = async () => {
    if (!singletons?.syncService) return;

    const { startLoading, stopLoading } = createLoadingStack();
    startLoading();

    setSyncOutLoadingStatus(LoadingStatuses.LOADING);
    try {
      const syncOutRes = await singletons.syncService.syncOut();
      logger.info('syncOutRes: ', syncOutRes);
      setLoadResult('Syncing Out was successful!');
    } catch (error) {
      logger.error('Error occurred while syncing out::', error);
      setLoadResult('Error occurred while syncing out.');
    } finally {
      stopLoading();
      setSyncOutLoadingStatus(LoadingStatuses.FINISHED);
    }
  };

  const doSyncIn = async () => {
    if (!singletons?.syncService) return;

    const { startLoading, stopLoading } = createLoadingStack();
    startLoading();

    setSyncInLoadingStatus(LoadingStatuses.LOADING);
    try {
      await singletons.syncService.syncIn();
      logger.info('sync done.');
      setLoadResult('Syncing In was successful!');
    } catch (error) {
      logger.fatal(
        'Error occurred while syncing in: ',
        JSON.stringify((error as Error).message),
      );
      setLoadResult('Error occurred while syncing in.');
    } finally {
      stopLoading();
      setSyncInLoadingStatus(LoadingStatuses.FINISHED);
    }
  };

  const doSyncOutViaJson = async () => {
    if (!singletons?.syncService) return;

    const { startLoading, stopLoading } = createLoadingStack();
    startLoading();

    setSyncOutViaJsonLoadingStatus(LoadingStatuses.LOADING);
    try {
      const syncOutRes = await singletons.syncService.syncOutViaJsonDB();
      logger.info('syncOutRes: ', syncOutRes);
      setLoadResult('Syncing Out was successful!');
    } catch (error) {
      logger.error('Error occurred while syncing out::', error);
      setLoadResult('Error occurred while syncing out.');
    } finally {
      stopLoading();
      setSyncOutViaJsonLoadingStatus(LoadingStatuses.FINISHED);
    }
  };

  const doSyncInViaJson = async () => {
    if (!singletons?.syncService) return;

    const { startLoading, stopLoading } = createLoadingStack();
    startLoading();

    setSyncInViaJsonLoadingStatus(LoadingStatuses.LOADING);
    try {
      await singletons.syncService.syncInViaJson();
      logger.info('sync done.');
      setLoadResult('Syncing In Via Json was successful!');
    } catch (error) {
      logger.fatal(
        'Error occurred while syncing in: ',
        JSON.stringify((error as Error).message),
      );
      setLoadResult('Error occurred while syncing in.');
    } finally {
      stopLoading();
      setSyncInViaJsonLoadingStatus(LoadingStatuses.FINISHED);
    }
  };

  const doDownloadDBJson = async () => {
    if (!singletons?.syncService) return;

    const { startLoading, stopLoading } = createLoadingStack();
    startLoading();

    try {
      const file = await singletons.syncService.getGzipJsonDB();

      const url = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      link.click();

      URL.revokeObjectURL(url);

      logger.info('download done.');
      setLoadResult('Download db.json.gz was successful!');
    } catch (error) {
      logger.fatal(
        'Error occurred while db.json.gz: ',
        JSON.stringify((error as Error).message),
      );
      setLoadResult('Error occurred while db.json.gz');
    } finally {
      stopLoading();
      setDownloadDBJsonLoadingStatus(LoadingStatuses.FINISHED);
    }
  };

  const dbJsonFileHandler: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      async (e) => {
        if (!singletons?.syncService) return false;

        const { startLoading, stopLoading } = createLoadingStack();
        startLoading();

        setSyncInViaJsonFileLoadingStatus(LoadingStatuses.LOADING);
        try {
          const file = e.target.files?.[0];
          if (!file) {
            alertFeedback(FeedbackTypes.ERROR, 'No file selected');
            return;
          }

          await singletons.syncService.syncInViaJsonFile(file);

          e.target.value = '';
          logger.info('sync done.');
          setLoadResult('Syncing In Via Json File was successful!');
        } catch (error) {
          logger.fatal(
            'Error occurred while syncing in: ',
            JSON.stringify((error as Error).message),
          );
          setLoadResult('Error occurred while syncing in.');
        } finally {
          stopLoading();
          setSyncInViaJsonFileLoadingStatus(LoadingStatuses.FINISHED);
        }
      },
      [singletons?.syncService, createLoadingStack, logger, alertFeedback],
    );

  const handleResetLocalGraphData = async () => {
    if (!singletons) return false;

    const { startLoading, stopLoading } = createLoadingStack();
    startLoading();

    try {
      await singletons.dbService.resetAllData();
      singletons.syncService.clearAllSyncInfo();
      alertFeedback(FeedbackTypes.SUCCESS, 'All database data deleted.');
    } catch (error) {
      logger.error(
        { at: 'handleResetLocalGraphData' },
        'Error when resetting data',
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <PageLayout>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Sync Data')}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <Stack
            gap="10px"
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Button
              variant="contained"
              className="text-transform-none"
              onClick={doSyncIn}
              disabled={syncInLoadingStatus === LoadingStatuses.LOADING}
            >
              {syncInLoadingStatus === LoadingStatuses.LOADING
                ? tr('Syncing In...')
                : tr('Sync In')}
            </Button>
            <Button
              variant="contained"
              className="text-transform-none"
              onClick={doSyncOut}
              disabled={syncOutLoadingStatus === LoadingStatuses.LOADING}
            >
              {syncOutLoadingStatus === LoadingStatuses.LOADING
                ? tr('Syncing Out...')
                : tr('Sync Out')}
            </Button>
          </Stack>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Sync Data Via db.json')}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <Stack
            gap="10px"
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Button
              variant="contained"
              className="text-transform-none"
              onClick={doSyncInViaJson}
              disabled={syncInViaJsonLoadingStatus === LoadingStatuses.LOADING}
            >
              {syncInViaJsonLoadingStatus === LoadingStatuses.LOADING
                ? tr('Syncing In...')
                : tr('Sync In')}
            </Button>
            <Button
              variant="contained"
              className="text-transform-none"
              onClick={doSyncOutViaJson}
              disabled={syncOutViaJsonLoadingStatus === LoadingStatuses.LOADING}
            >
              {syncOutViaJsonLoadingStatus === LoadingStatuses.LOADING
                ? tr('Syncing Out...')
                : tr('Sync Out')}
            </Button>
          </Stack>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Sync Data Via db.json.gz')}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <Stack
            gap="10px"
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Button
              variant="contained"
              className="text-transform-none"
              disabled={
                syncInViaJsonFileLoadingStatus === LoadingStatuses.LOADING
              }
              component="label"
            >
              {syncInViaJsonFileLoadingStatus === LoadingStatuses.LOADING
                ? tr('Syncing In Via db.json.gz...')
                : tr('Sync In Via db.json.gz')}
              <input
                hidden
                multiple={false}
                onChange={dbJsonFileHandler}
                type="file"
              />
            </Button>
            <Button
              variant="contained"
              className="text-transform-none"
              onClick={doDownloadDBJson}
              disabled={downloadDBJsonLoadingStatus === LoadingStatuses.LOADING}
            >
              {downloadDBJsonLoadingStatus === LoadingStatuses.LOADING
                ? tr('Download db.json.gz...')
                : tr('Download db.json.gz')}
            </Button>
          </Stack>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Delete all local data')}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <Button
            variant="contained"
            className="text-transform-none"
            onClick={handleResetLocalGraphData}
          >
            {tr('Reset Local Data')}
          </Button>
        </IonCardContent>
      </IonCard>

      <IonToast
        isOpen={!!loadResult}
        onDidDismiss={() => {
          setLoadResult('');
        }}
        color={
          loadResult.search(RegExp(/(error)/, 'gmi')) > -1
            ? 'danger'
            : FeedbackTypes.SUCCESS
        }
        message={loadResult}
        duration={5000}
      />
    </PageLayout>
  );
}
