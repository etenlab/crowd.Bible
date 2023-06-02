export const SQLRUNNER_LOCAL_FORAGE_KEY = 'sqlRunner';

export const USER_TOKEN_KEY = 'userToken';

export enum ColorThemes {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum VoteTypes {
  UP = 'up',
  DOWN = 'down',
}
export type UpOrDownVote = VoteTypes.UP | VoteTypes.DOWN;

export enum FeedbackTypes {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export enum LoadingStatuses {
  INITIAL = 'initial',
  LOADING = 'loading',
  FINISHED = 'finished',
}

export enum UserRoles {
  TRANSLATOR = 'translator',
  READER = 'reader',
}
