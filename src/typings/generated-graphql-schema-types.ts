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
  playback?: Track;
  queue?: Array<Track | null>;
  usersInRoom?: Array<User | null>;
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
  image?: string;
}

export interface Room {
  id: string;
  name: string;
  host: User;
  mode: string;
  private: boolean;
  users?: Array<User | null>;
  playback?: Track;
  queue?: Array<Track | null>;
}

export interface Track {
  id?: string;
  uri?: string;
  name?: string;
  artists?: Array<Artist | null>;
  images?: Array<SpotifyImage | null>;
  voters?: Array<User | null>;
  queueTimestamp?: string;
  playTimestamp?: string;
  position?: number;
  duration?: number;
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
  createRoom?: Room;
  updateRoom: boolean;
  addTrackToQueue: Track;
  voteForTrack: boolean;
  enterRoom: boolean;
  leaveRoom: boolean;
}

export interface CreateRoomInput {
  name: string;
  mode: string;
  private: boolean;
}

export interface UpdateRoomInput {
  id: string;
  name: string;
  mode: string;
  private: boolean;
}

export interface AddTrackToQueueInput {
  roomId: string;
  trackId: string;
}

export interface VoteForTrackInput {
  roomId: string;
  trackId: string;
}

export interface Subscription {
  trackAddedToQueue?: Track;
  trackVotedOnInQueue?: Track;
  trackRemovedFromQueue?: Track;
  room?: RoomUpdate;
  playback?: Track;
  userEnteredRoom?: User;
  userLeftRoom?: User;
}

export interface RoomUpdate {
  name: string;
  mode: string;
  private: boolean;
}

export interface PlayTrackInput {
  roomId: string;
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
  Subscription?: SubscriptionTypeResolver;
  RoomUpdate?: RoomUpdateTypeResolver;
}
export interface QueryTypeResolver<TParent = any> {
  user?: QueryToUserResolver<TParent>;
  room?: QueryToRoomResolver<TParent>;
  rooms?: QueryToRoomsResolver<TParent>;
  playback?: QueryToPlaybackResolver<TParent>;
  queue?: QueryToQueueResolver<TParent>;
  usersInRoom?: QueryToUsersInRoomResolver<TParent>;
}

export interface QueryToUserArgs {
  query?: string;
}
export interface QueryToUserResolver<TParent = any, TResult = any> {
  (parent: TParent, args: QueryToUserArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface QueryToRoomArgs {
  roomId: string;
}
export interface QueryToRoomResolver<TParent = any, TResult = any> {
  (parent: TParent, args: QueryToRoomArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface QueryToRoomsResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface QueryToPlaybackArgs {
  roomId: string;
}
export interface QueryToPlaybackResolver<TParent = any, TResult = any> {
  (parent: TParent, args: QueryToPlaybackArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface QueryToQueueArgs {
  roomId: string;
}
export interface QueryToQueueResolver<TParent = any, TResult = any> {
  (parent: TParent, args: QueryToQueueArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface QueryToUsersInRoomArgs {
  roomId: string;
}
export interface QueryToUsersInRoomResolver<TParent = any, TResult = any> {
  (parent: TParent, args: QueryToUsersInRoomArgs, context: any, info: GraphQLResolveInfo): TResult;
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
  image?: UserToImageResolver<TParent>;
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

export interface UserToImageResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface RoomTypeResolver<TParent = any> {
  id?: RoomToIdResolver<TParent>;
  name?: RoomToNameResolver<TParent>;
  host?: RoomToHostResolver<TParent>;
  mode?: RoomToModeResolver<TParent>;
  private?: RoomToPrivateResolver<TParent>;
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

export interface RoomToModeResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface RoomToPrivateResolver<TParent = any, TResult = any> {
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
  uri?: TrackToUriResolver<TParent>;
  name?: TrackToNameResolver<TParent>;
  artists?: TrackToArtistsResolver<TParent>;
  images?: TrackToImagesResolver<TParent>;
  voters?: TrackToVotersResolver<TParent>;
  queueTimestamp?: TrackToQueueTimestampResolver<TParent>;
  playTimestamp?: TrackToPlayTimestampResolver<TParent>;
  position?: TrackToPositionResolver<TParent>;
  duration?: TrackToDurationResolver<TParent>;
}

export interface TrackToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface TrackToUriResolver<TParent = any, TResult = any> {
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

export interface TrackToQueueTimestampResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface TrackToPlayTimestampResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface TrackToPositionResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface TrackToDurationResolver<TParent = any, TResult = any> {
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
  updateRoom?: MutationToUpdateRoomResolver<TParent>;
  addTrackToQueue?: MutationToAddTrackToQueueResolver<TParent>;
  voteForTrack?: MutationToVoteForTrackResolver<TParent>;
  enterRoom?: MutationToEnterRoomResolver<TParent>;
  leaveRoom?: MutationToLeaveRoomResolver<TParent>;
}

export interface MutationToCreateRoomArgs {
  input: CreateRoomInput;
}
export interface MutationToCreateRoomResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToCreateRoomArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface MutationToUpdateRoomArgs {
  input: UpdateRoomInput;
}
export interface MutationToUpdateRoomResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToUpdateRoomArgs, context: any, info: GraphQLResolveInfo): TResult;
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

export interface MutationToEnterRoomArgs {
  roomId: string;
}
export interface MutationToEnterRoomResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToEnterRoomArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface MutationToLeaveRoomArgs {
  roomId: string;
}
export interface MutationToLeaveRoomResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToLeaveRoomArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface SubscriptionTypeResolver<TParent = any> {
  trackAddedToQueue?: SubscriptionToTrackAddedToQueueResolver<TParent>;
  trackVotedOnInQueue?: SubscriptionToTrackVotedOnInQueueResolver<TParent>;
  trackRemovedFromQueue?: SubscriptionToTrackRemovedFromQueueResolver<TParent>;
  room?: SubscriptionToRoomResolver<TParent>;
  playback?: SubscriptionToPlaybackResolver<TParent>;
  userEnteredRoom?: SubscriptionToUserEnteredRoomResolver<TParent>;
  userLeftRoom?: SubscriptionToUserLeftRoomResolver<TParent>;
}

export interface SubscriptionToTrackAddedToQueueArgs {
  roomId: string;
}
export interface SubscriptionToTrackAddedToQueueResolver<TParent = any, TResult = any> {
  resolve?: (parent: TParent, args: SubscriptionToTrackAddedToQueueArgs, context: any, info: GraphQLResolveInfo) => TResult;
  subscribe: (parent: TParent, args: SubscriptionToTrackAddedToQueueArgs, context: any, info: GraphQLResolveInfo) => AsyncIterator<TResult>;
}

export interface SubscriptionToTrackVotedOnInQueueArgs {
  roomId: string;
}
export interface SubscriptionToTrackVotedOnInQueueResolver<TParent = any, TResult = any> {
  resolve?: (parent: TParent, args: SubscriptionToTrackVotedOnInQueueArgs, context: any, info: GraphQLResolveInfo) => TResult;
  subscribe: (parent: TParent, args: SubscriptionToTrackVotedOnInQueueArgs, context: any, info: GraphQLResolveInfo) => AsyncIterator<TResult>;
}

export interface SubscriptionToTrackRemovedFromQueueArgs {
  roomId: string;
}
export interface SubscriptionToTrackRemovedFromQueueResolver<TParent = any, TResult = any> {
  resolve?: (parent: TParent, args: SubscriptionToTrackRemovedFromQueueArgs, context: any, info: GraphQLResolveInfo) => TResult;
  subscribe: (parent: TParent, args: SubscriptionToTrackRemovedFromQueueArgs, context: any, info: GraphQLResolveInfo) => AsyncIterator<TResult>;
}

export interface SubscriptionToRoomArgs {
  roomId: string;
}
export interface SubscriptionToRoomResolver<TParent = any, TResult = any> {
  resolve?: (parent: TParent, args: SubscriptionToRoomArgs, context: any, info: GraphQLResolveInfo) => TResult;
  subscribe: (parent: TParent, args: SubscriptionToRoomArgs, context: any, info: GraphQLResolveInfo) => AsyncIterator<TResult>;
}

export interface SubscriptionToPlaybackArgs {
  roomId: string;
}
export interface SubscriptionToPlaybackResolver<TParent = any, TResult = any> {
  resolve?: (parent: TParent, args: SubscriptionToPlaybackArgs, context: any, info: GraphQLResolveInfo) => TResult;
  subscribe: (parent: TParent, args: SubscriptionToPlaybackArgs, context: any, info: GraphQLResolveInfo) => AsyncIterator<TResult>;
}

export interface SubscriptionToUserEnteredRoomArgs {
  roomId: string;
}
export interface SubscriptionToUserEnteredRoomResolver<TParent = any, TResult = any> {
  resolve?: (parent: TParent, args: SubscriptionToUserEnteredRoomArgs, context: any, info: GraphQLResolveInfo) => TResult;
  subscribe: (parent: TParent, args: SubscriptionToUserEnteredRoomArgs, context: any, info: GraphQLResolveInfo) => AsyncIterator<TResult>;
}

export interface SubscriptionToUserLeftRoomArgs {
  roomId: string;
}
export interface SubscriptionToUserLeftRoomResolver<TParent = any, TResult = any> {
  resolve?: (parent: TParent, args: SubscriptionToUserLeftRoomArgs, context: any, info: GraphQLResolveInfo) => TResult;
  subscribe: (parent: TParent, args: SubscriptionToUserLeftRoomArgs, context: any, info: GraphQLResolveInfo) => AsyncIterator<TResult>;
}

export interface RoomUpdateTypeResolver<TParent = any> {
  name?: RoomUpdateToNameResolver<TParent>;
  mode?: RoomUpdateToModeResolver<TParent>;
  private?: RoomUpdateToPrivateResolver<TParent>;
}

export interface RoomUpdateToNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface RoomUpdateToModeResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface RoomUpdateToPrivateResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}
