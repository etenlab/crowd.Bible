import { actions } from './global.actions';
import { type ActionType } from '.';
import { type ISingletons } from '@/src/singletons';
import {
  ColorThemes,
  FeedbackTypes,
  UserRoles,
} from '@/constants/common.constant';
import { LanguageInfo } from '@eten-lab/ui-kit';
import { AppDto } from '@/dtos/document.dto';

export type FeedbackType =
  | FeedbackTypes.SUCCESS
  | FeedbackTypes.ERROR
  | FeedbackTypes.INFO
  | FeedbackTypes.WARNING;

export interface SnackType {
  open: boolean;
  message: string;
  severity: FeedbackType;
}
export interface TranslatedMap {
  translatedMapStr?: string;
}

const initialTranslatedMap: TranslatedMap = {
  translatedMapStr: undefined,
};

export type RoleType = UserRoles[];
export type PrefersColorSchemeType = ColorThemes.LIGHT | ColorThemes.DARK;

export interface IUser {
  userId: string;
  userEmail: string;
  roles: RoleType;
}

export interface IMode {
  admin: boolean;
  beta: boolean;
}

export interface TempSiteTextItem {
  appId: Nanoid;
  siteText: string;
  definition: string;
  languageInfo: LanguageInfo;
}

export interface Loading {
  message?: string;
  status?: string;
  isCancelButton?: boolean;
}

export interface StateType {
  user: IUser | null;
  mode: IMode;
  snack: SnackType;
  prefersColorScheme?: ColorThemes.LIGHT | ColorThemes.DARK;
  loading?: Loading;
  connectivity: boolean;
  isNewDiscussion: boolean;
  isNewNotification: boolean;
  translatedMap: TranslatedMap;
  singletons: ISingletons | null;
  appLanguage: LanguageInfo;
  crowdBibleApp: AppDto | null;
  isSqlPortalShown: boolean;
  sqlPortalPosition?: { x: number; y: number } | undefined;
  siteTextMap: Record<string, { siteText: string; isTranslated: boolean }>;
  tempSiteTexts: TempSiteTextItem[];
}

const initialSnack: SnackType = {
  open: false,
  message: '',
  severity: FeedbackTypes.SUCCESS,
};

export const initialState: StateType = {
  user: null,
  mode: {
    admin: false,
    beta: false,
  },
  snack: initialSnack,
  prefersColorScheme: undefined,
  connectivity: true,
  isNewDiscussion: false,
  isNewNotification: false,
  translatedMap: initialTranslatedMap,
  singletons: null,
  appLanguage: {
    lang: {
      tag: 'en',
      descriptions: ['English'],
    },
  },
  crowdBibleApp: null,
  isSqlPortalShown: false,
  siteTextMap: {},
  tempSiteTexts: [],
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const prevState = { ...state };
  const { type } = action;

  switch (type) {
    case actions.ALERT_FEEDBACK: {
      const { feedbackType, message } = action.payload as {
        feedbackType: FeedbackType;
        message: string;
      };
      return {
        ...prevState,
        snack: {
          open: true,
          message,
          severity: feedbackType,
        },
      };
    }
    case actions.CLOSE_FEEDBACK: {
      return {
        ...prevState,
        snack: { ...initialSnack },
      };
    }
    case actions.SET_USER: {
      return {
        ...prevState,
        user: action.payload as IUser,
      };
    }
    case actions.SET_ROLE: {
      if (prevState.user != null) {
        const newRoles = prevState.user.roles;
        newRoles.push(action.payload as UserRoles);
        return {
          ...prevState,
          user: {
            ...prevState.user,
            roles: newRoles,
          },
        };
      } else {
        return prevState;
      }
    }
    case actions.SET_MODE: {
      return {
        ...prevState,
        mode: action.payload as IMode,
      };
    }
    case actions.SET_PREFERS_COLOR_SCHEME: {
      return {
        ...prevState,
        prefersColorScheme: action.payload as PrefersColorSchemeType,
      };
    }
    case actions.SET_CONNECTIVITY: {
      return {
        ...prevState,
        connectivity: action.payload as boolean,
      };
    }
    case actions.LOGOUT: {
      return {
        ...prevState,
        user: null,
      };
    }
    case actions.SET_LOGING_STATE: {
      return {
        ...prevState,
        loading: action.payload as Loading | undefined,
      };
    }
    case actions.SET_SINGLETONS: {
      return {
        ...prevState,
        singletons: action.payload as ISingletons,
      };
    }
    case actions.SET_SQL_PORTAL_SHOWN: {
      const { isShown, position } = action.payload as {
        isShown: boolean;
        position: { x: number; y: number } | undefined;
      };
      return {
        ...prevState,
        isSqlPortalShown: isShown,
        sqlPortalPosition: position,
      };
    }
    case actions.CHANGE_APP_LANGUAGE: {
      return {
        ...prevState,
        appLanguage: action.payload as LanguageInfo,
      };
    }
    case actions.SET_SITE_TEXT_MAP: {
      return {
        ...prevState,
        siteTextMap: action.payload as Record<
          string,
          { siteText: string; isTranslated: boolean }
        >,
      };
    }
    case actions.ADD_TEMP_SITE_TEXTS: {
      const item = action.payload as TempSiteTextItem;

      if (
        prevState.tempSiteTexts.find(
          (data) =>
            data.appId === item.appId && data.siteText === item.siteText,
        ) ||
        prevState.siteTextMap[item.siteText]
      ) {
        return {
          ...prevState,
        };
      } else {
        return {
          ...prevState,
          tempSiteTexts: [...prevState.tempSiteTexts, item],
        };
      }
    }
    case actions.CLEAR_TEMP_SITE_TEXTS: {
      return {
        ...prevState,
        tempSiteTexts: [],
      };
    }
    case actions.SET_CROWD_BIBLE_APP: {
      return {
        ...prevState,
        crowdBibleApp: action.payload as AppDto,
      };
    }
    default: {
      return prevState;
    }
  }
}
