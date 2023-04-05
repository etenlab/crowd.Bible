// import React, { useEffect, useRef, useCallback, CSSProperties } from "react";
//
// import {
//   Stack,
//   Snackbar,
//   Alert,
//   Popover,
//   CircularProgress,
//   Backdrop,
//   ThemeProvider,
// } from "@mui/material";
//
// import { theme } from "./theme";
//
// import { DiscussionProvider } from "./context";
// import { EmojiClickData } from "emoji-picker-react";
// import { EmojiPicker } from "./EmojiPicker";
// import { PostList } from "./Post";
// import { InputModeSelector } from "./InputModeSelector";
// import { ReactQuill } from "./ReactQuill";
// import { AudioRecorder } from "./AudioRecorder";
// import { VideoRecorder } from "./VideoRecorder";
//
// import { IPost } from "./utils/types";
// import { useDiscussionContext } from "./hooks/useDiscussionContext";
//
// import { withUserId } from "./withUserId";
//
// const InputComponents = {
//   selector: InputModeSelector,
//   quill: ReactQuill,
//   audio: AudioRecorder,
//   video: VideoRecorder,
// };
//
// type InputComponentsKey = keyof typeof InputComponents;
//
// type DiscussionPureProps = {
//   userId: number;
//   tableName: string;
//   rowId: number;
//   style: CSSProperties | undefined;
// };

/**
 * This component will mount once users route to '/tab1/discussion/:table_name/:row'.
 * The responsibility is to control Discussion Page and interact with server such as fetching, saving, deleting discussion data.
 */
// function DiscussionPure({
//   userId,
//   tableName,
//   rowId,
//   style,
// }: DiscussionPureProps) {
//   const {
//     states: { loading: discussionLoading, global, quillRef, uploading },
//     actions: {
//       changeDiscussionByTableNameAndRow,
//       setNewUser,
//       closeFeedback,
//       closeEmojiPicker,
//       createReaction,
//       deleteReaction,
//     },
//   } = useDiscussionContext();
//
//   const { snack, emoji, editorKind } = global;
//
//   useEffect(() => {
//     if (global.userId !== userId) {
//       setNewUser(userId);
//     }
//   }, [userId, setNewUser, global.userId]);
//
//   useEffect(() => {
//     changeDiscussionByTableNameAndRow(tableName, rowId);
//   }, [tableName, rowId, changeDiscussionByTableNameAndRow]);
//
//   const discussionRef = useRef<HTMLElement>(null);
//
//   const handleEmojiClickByReact = useCallback(
//     (post: IPost | null, emojiData: EmojiClickData) => {
//       if (post) {
//         const reaction = post.reactions.find(
//           (reaction) =>
//             reaction.content === emojiData.unified &&
//             reaction.user_id === userId
//         );
//
//         if (reaction) {
//           deleteReaction({
//             variables: {
//               id: reaction.id,
//               userId,
//             },
//           });
//         } else {
//           createReaction({
//             variables: {
//               reaction: {
//                 content: emojiData.unified,
//                 post_id: post.id,
//                 user_id: userId,
//               },
//             },
//           });
//         }
//       }
//     },
//     [deleteReaction, createReaction, userId]
//   );
//
//   const handleEmojiClickByQuill = useCallback(
//     (emojiData: EmojiClickData) => {
//       quillRef.current?.write(emojiData.emoji);
//     },
//     [quillRef]
//   );
//
//   const handleEmojiClick = useCallback(
//     (emojiData: EmojiClickData) => {
//       if (emoji.mode === "quill") {
//         handleEmojiClickByQuill(emojiData);
//       }
//
//       if (emoji.mode === "react") {
//         handleEmojiClickByReact(emoji.post, emojiData);
//       }
//
//       closeEmojiPicker();
//     },
//     [emoji, handleEmojiClickByQuill, handleEmojiClickByReact, closeEmojiPicker]
//   );
//
//   const openedEmojiPicker = Boolean(emoji.anchorEl);
//
//   const editorKindString = editorKind || "selector";
//
//   const InputComponent =
//     InputComponents[editorKindString as InputComponentsKey];
//
//   const loading = discussionLoading || (uploading && editorKind !== null);
//
//   return (
//     <>
//       <Stack
//         justifyContent="space-between"
//         gap="20px"
//         style={style}
//         ref={discussionRef}
//       >
//         <PostList />
//         <InputComponent />
//       </Stack>
//
//       <Popover
//         open={discussionRef.current !== null}
//         anchorEl={
//           emoji.anchorEl === null ? discussionRef.current : emoji.anchorEl
//         }
//         onClose={closeEmojiPicker}
//         anchorOrigin={{
//           vertical: "top",
//           horizontal: "right",
//         }}
//         sx={{
//           display: openedEmojiPicker ? "inherit" : "none",
//         }}
//       >
//         <EmojiPicker onEmojiClick={handleEmojiClick} />
//       </Popover>
//
//       <Snackbar
//         open={snack.open}
//         autoHideDuration={2000}
//         onClose={closeFeedback}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "right",
//         }}
//         key="bottom-right"
//       >
//         <Alert
//           variant="filled"
//           onClose={closeFeedback}
//           severity={snack.severity}
//           sx={{ width: "100%" }}
//         >
//           {snack.message}
//         </Alert>
//       </Snackbar>
//
//       <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={loading}>
//         <Stack justifyContent="center">
//           <div style={{ margin: "auto" }}>
//             <CircularProgress color="inherit" />
//           </div>
//           <div>LOADING</div>
//         </Stack>
//       </Backdrop>
//     </>
//   );
// }
//
// type DiscussionProps = {
//   userInfo: unknown;
//   userInfoType: "email" | "name" | "user_id";
//   tableName: string;
//   rowId: number;
//   style: CSSProperties | undefined;
// };
//
// const DiscussionWithLogin = withUserId(DiscussionPure);
//
// export function Discussion(props: DiscussionProps) {
//   return (
//     <ThemeProvider theme={theme}>
//       <DiscussionProvider>
//         <DiscussionWithLogin {...props} />
//       </DiscussionProvider>
//     </ThemeProvider>
//   );
// }

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
