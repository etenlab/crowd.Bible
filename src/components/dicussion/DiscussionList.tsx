import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import { Discussion } from '@/models/index';
import { IonChip } from '@ionic/react';

import { MuiMaterial } from '@eten-lab/ui-kit';

import AppRoutes from '@/constants/AppRoutes';

// import { discussionClient } from "./graphql/discussionGraphql";
// import { GET_DISCUSSIONS_SUMMARY_BY_USER_ID } from "./graphql/discussionQuery";
// import { withUserId } from "./withUserId";

const { List, ListItem, ListItemText, Divider } = MuiMaterial;

interface PropsDiscussionList {
  discussions: Discussion[];
}

export const DiscussionList: React.FC<PropsDiscussionList> = ({
  discussions,
}) => {
  const history = useHistory();

  // const [
  //   getDiscussionsSummaryByUserId,
  //   { called, loading, error, data },
  // ] = useLazyQuery(GET_DISCUSSIONS_SUMMARY_BY_USER_ID, {
  //   fetchPolicy: "no-cache",
  //   client: discussionClient,
  // });

  // useEffect(() => {
  //   if (userId) {
  //     getDiscussionsSummaryByUserId({
  //       variables: {
  //         userId,
  //       },
  //     });
  //   }
  // }, [userId, getDiscussionsSummaryByUserId]);

  // if (error) {
  //   <Snackbar
  //     open
  //     autoHideDuration={2000}
  //     anchorOrigin={{
  //       vertical: "bottom",
  //       horizontal: "right",
  //     }}
  //     key="bottom-right"
  //   >
  //     <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
  //       Network Issue
  //     </Alert>
  //   </Snackbar>;
  // }

  // if (called && loading) {
  //   return (
  //     <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={loading}>
  //       <Stack justifyContent="center">
  //         <div style={{ margin: "auto" }}>
  //           <CircularProgress color="inherit" />
  //         </div>
  //         <div>LOADING</div>
  //       </Stack>
  //     </Backdrop>
  //   );
  // }
  //
  // if (data === undefined) {
  //   return <div>No Discussions...</div>;
  // }

  return (
    <List>
      {discussions.map(({ id, tableName, row }) => (
        <Fragment key={id}>
          <ListItem
            secondaryAction={
              <IonChip
                title="New: 5"
                color={'danger'}
                className="chip-btn bg-danger"
              >
                New: 5
              </IonChip>
            }
            disablePadding
            onClick={() => {
              history.push({
                pathname: `${AppRoutes.discussions}/${id}`,
              });
            }}
          >
            <ListItemText
              primary={tableName}
              secondary={`Total discussions: ${row}`}
            />
          </ListItem>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};

// export const DiscussionList = withUserId(DiscussionListPure);
