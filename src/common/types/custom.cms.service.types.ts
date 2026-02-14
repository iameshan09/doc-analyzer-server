import {
  TCCLandingPage,
  TCCStory,
} from '../zod-schemas/cc-landing-page-zod-schema';

type TCommonResponseData = {
  status: 'fail' | 'success';
  message: string;
};

type TNewEntryResponseData = TCommonResponseData & {
  entryId: number;
};

type TCCMetaData = {
  entryId: number;
  createdAt: Date;
  updatedAt: Date;
  contentType: string;
};

type TCCEntity = {
  metaData: TCCMetaData;
};

type TCcObject<T> = {
  ccEntry: TCCEntity;
  identifier: string;
} & T;

type TUpdateLandingPageContent = Partial<TCCLandingPage>;

type TGetLandingPageContentByPageIdQuery = { entity: string };

type TContent<T, K extends Record<string, any> = object> = {
  id: number;
  identifier: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  data: T;
  references: K;
  contentType: string;
};

export type TLandingPageStatus = 'initiated' | 'active' | 'inactive';

type TCommonContentData = {
  identifier: string;
  locale: string;
};

type TLandingPageContentData = {
  name: string;
  pageId: string;
  status: TLandingPageStatus;
  preview_image?: string;
  subdomain?: string;
};

type TCCError = {
  message: string;
};

type TLandingPageStoryContentData = TCommonContentData &
  Omit<TCCStory, 'ccEntry'>;

type TLandingPageRefs = {
  story?: TContent<TLandingPageStoryContentData>[];
};

type TCcNewEntryRequestBody<TData = {}, TRef = {}> = {
  identifier: string;
  data: TData;
  localeData: {
    [locale: string]: TData;
  };
  references: TRef;
  workspaceId: string | number;
  contentTypeId: string | number;
  published: boolean;
};

export type {
  TNewEntryResponseData,
  TCommonResponseData,
  TCcObject,
  TUpdateLandingPageContent,
  TGetLandingPageContentByPageIdQuery,
  TCCError,
  TLandingPageRefs,
  TContent,
  TLandingPageContentData,
  TCcNewEntryRequestBody,
};
