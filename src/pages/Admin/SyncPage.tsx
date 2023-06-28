import { useState } from 'react';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToast,
} from '@ionic/react';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { FeedbackTypes, LoadingStatuses } from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

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
          <IonButton
            className="text-transform-none"
            onClick={doSyncIn}
            disabled={syncInLoadingStatus === LoadingStatuses.LOADING}
          >
            {syncInLoadingStatus === LoadingStatuses.LOADING
              ? tr('Syncing In...')
              : tr('Sync In')}
          </IonButton>
          <IonButton
            className="text-transform-none"
            onClick={doSyncOut}
            disabled={syncOutLoadingStatus === LoadingStatuses.LOADING}
          >
            {syncOutLoadingStatus === LoadingStatuses.LOADING
              ? tr('Syncing Out...')
              : tr('Sync Out')}
          </IonButton>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{tr('Delete all local data')}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton
            className="text-transform-none"
            onClick={handleResetLocalGraphData}
          >
            {tr('Reset Local Data')}
          </IonButton>
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
