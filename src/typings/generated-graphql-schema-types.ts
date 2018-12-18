/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql';
/**
 * This file is auto-generated by graphql-schema-typescript
 * Please note that any changes in this file may be overwritten
 */
 

/*******************************
 *                             *
 *          TYPE DEFS          *
 *                             *
 *******************************/
export interface Query {
  user?: User;
  room?: Room;
  rooms?: Array<Room | null>;
}

export interface User {
  id: string;
  spotifyId?: string;
  accessToken?: string;
  refreshToken?: string;
  expires?: number;
  displayName?: string;
  email?: string;
  country?: string;
}

export interface Room {
  id: string;
  name: string;
  host: User;
  users?: Array<User | null>;
  playback?: Track;
  queue?: Array<Track | null>;
}

export interface Track {
  id?: string;
  name?: string;
  artists?: Array<Artist | null>;
  images?: Array<SpotifyImage | null>;
  voters?: Array<User | null>;
}

export interface Artist {
  id?: string;
  name?: string;
}

export interface SpotifyImage {
  url?: string;
  width?: number;
  height?: number;
}

export interface Mutation {
  createRoom: boolean;
  addTrackToQueue: boolean;
  voteForTrack: boolean;
}

export interface CreateRoomInput {
  name: string;
}

export interface AddTrackToQueueInput {
  roomId: string;
  trackId: string;
}

export interface VoteForTrackInput {
  roomId: string;
  trackId: string;
}

/*********************************
 *                               *
 *         TYPE RESOLVERS        *
 *                               *
 *********************************/
/**
 * This interface define the shape of your resolver
 * Note that this type is designed to be compatible with graphql-tools resolvers
 * However, you can still use other generated interfaces to make your resolver type-safed
 */
export interface Resolver {
  Query?: QueryTypeResolver;
  User?: UserTypeResolver;
  Room?: RoomTypeResolver;
  Track?: TrackTypeResolver;
  Artist?: ArtistTypeResolver;
  SpotifyImage?: SpotifyImageTypeResolver;
  Mutation?: MutationTypeResolver;
}
export interface QueryTypeResolver<TParent = any> {
  user?: QueryToUserResolver<TParent>;
  room?: QueryToRoomResolver<TParent>;
  rooms?: QueryToRoomsResolver<TParent>;
}

export interface QueryToUserArgs {
  query?: string;
}
export interface QueryToUserResolver<TParent = any, TResult = any> {
  (parent: TParent, args: QueryToUserArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface QueryToRoomArgs {
  query: string;
}
export interface QueryToRoomResolver<TParent = any, TResult = any> {
  (parent: TParent, args: QueryToRoomArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface QueryToRoomsResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserTypeResolver<TParent = any> {
  id?: UserToIdResolver<TParent>;
  spotifyId?: UserToSpotifyIdResolver<TParent>;
  accessToken?: UserToAccessTokenResolver<TParent>;
  refreshToken?: UserToRefreshTokenResolver<TParent>;
  expires?: UserToExpiresResolver<TParent>;
  displayName?: UserToDisplayNameResolver<TParent>;
  email?: UserToEmailResolver<TParent>;
  country?: UserToCountryResolver<TParent>;
}

export interface UserToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToSpotifyIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToAccessTokenResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToRefreshTokenResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToExpiresResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToDisplayNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToEmailResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToCountryResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface RoomTypeResolver<TParent = any> {
  id?: RoomToIdResolver<TParent>;
  name?: RoomToNameResolver<TParent>;
  host?: RoomToHostResolver<TParent>;
  users?: RoomToUsersResolver<TParent>;
  playback?: RoomToPlaybackResolver<TParent>;
  queue?: RoomToQueueResolver<TParent>;
}

export interface RoomToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface RoomToNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface RoomToHostResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface RoomToUsersResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface RoomToPlaybackResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface RoomToQueueResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface TrackTypeResolver<TParent = any> {
  id?: TrackToIdResolver<TParent>;
  name?: TrackToNameResolver<TParent>;
  artists?: TrackToArtistsResolver<TParent>;
  images?: TrackToImagesResolver<TParent>;
  voters?: TrackToVotersResolver<TParent>;
}

export interface TrackToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface TrackToNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface TrackToArtistsResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface TrackToImagesResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface TrackToVotersResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface ArtistTypeResolver<TParent = any> {
  id?: ArtistToIdResolver<TParent>;
  name?: ArtistToNameResolver<TParent>;
}

export interface ArtistToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface ArtistToNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface SpotifyImageTypeResolver<TParent = any> {
  url?: SpotifyImageToUrlResolver<TParent>;
  width?: SpotifyImageToWidthResolver<TParent>;
  height?: SpotifyImageToHeightResolver<TParent>;
}

export interface SpotifyImageToUrlResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface SpotifyImageToWidthResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface SpotifyImageToHeightResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface MutationTypeResolver<TParent = any> {
  createRoom?: MutationToCreateRoomResolver<TParent>;
  addTrackToQueue?: MutationToAddTrackToQueueResolver<TParent>;
  voteForTrack?: MutationToVoteForTrackResolver<TParent>;
}

export interface MutationToCreateRoomArgs {
  input: CreateRoomInput;
}
export interface MutationToCreateRoomResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToCreateRoomArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface MutationToAddTrackToQueueArgs {
  input: AddTrackToQueueInput;
}
export interface MutationToAddTrackToQueueResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToAddTrackToQueueArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface MutationToVoteForTrackArgs {
  input: VoteForTrackInput;
}
export interface MutationToVoteForTrackResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToVoteForTrackArgs, context: any, info: GraphQLResolveInfo): TResult;
}
