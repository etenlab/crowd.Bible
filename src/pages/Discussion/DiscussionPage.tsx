import { useHistory, useParams } from 'react-router';

import {
  MuiMaterial,
  CrowdBibleUI,
  DiscussionBoxUI,
  Alert,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { PageLayout } from '@/components/Layout';
import { FeedbackTypes } from '@/src/constants/common.constant';

const { HeadBox } = CrowdBibleUI;
const { Discussion } = DiscussionBoxUI;
const { AlertTitle } = MuiMaterial;

function getWsUrlFromHttp(httpUrl: string, error: () => void): string {
  const [protocol, host] = httpUrl.split('://');

  if (protocol === 'http') {
    return `ws://${host}`;
  } else if (protocol === 'https') {
    return `wss://${host}`;
  }

  error();

  return '';
}

export function DiscussionPage() {
  const { tr } = useTr();
  const { table_name, row_id } = useParams<{
    table_name?: string;
    row_id?: string;
  }>();
  const history = useHistory();
  const {
    states: {
      global: { user },
    },
    actions: { alertFeedback },
  } = useAppContext();

  const handleClickCancel = () => {
    history.goBack();
  };

  const discussionUI =
    table_name &&
    table_name?.length > 0 &&
    row_id &&
    row_id?.length > 0 &&
    user != null ? (
      <Discussion
        user={user}
        tableName={table_name}
        rowId={row_id}
        httpUri={`${process.env.REACT_APP_CPG_SERVER_URL || ''}/graphql`}
        wsUri={`${getWsUrlFromHttp(
          process.env.REACT_APP_CPG_SERVER_URL || '',
          () => {
            alertFeedback(
              FeedbackTypes.ERROR,
              `Cannot convert httpUri(${process.env.REACT_APP_CPG_SERVER_URL}) to wsUri`,
            );
          },
        )}/graphql`}
        height="calc(100vh - 130px)"
      />
    ) : (
      <Alert severity="error">
        <AlertTitle>This page has some issue!</AlertTitle>
        Please check you did login...
      </Alert>
    );

  return (
    <PageLayout>
      <HeadBox back={{ action: handleClickCancel }} title={tr('Discussion')} />
      {discussionUI}
    </PageLayout>
  );
}
