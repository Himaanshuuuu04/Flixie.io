"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import { client, databases } from "../Appwrite/Config";
import { store } from "./Store";
import { initializeAuth } from "./Slice/authSlice";
import { clearMoviesByGenre } from "./Slice/genreSlice";
import {
  clearLikeData,
  fetchLikedMovies,
  fetchWatchedMovies,
} from "./Slice/likeSlice";
import {
  clearFriendData,
  fetchFriendRequests,
  fetchFriends,
  friendRequestCreated,
  friendRequestDeleted,
  friendRequestUpdated,
} from "./Slice/friendSlice";
import {
  resetSearchState,
  setSearchActive,
  setSearchTerm,
} from "./Slice/searchSlice";

const getTimestamp = () => new Date().toISOString();

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
type AuthState = {
  logged: boolean;
  profileCompleted: boolean;
  loading: boolean;
  currentUser: { $id: string } | null;
  error: string | null;
};
type FriendRequestPayload = {
  senderId?: string;
  receiverId?: string;
  $id?: string;
  status?: string;
};

export default function ReduxBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth as AuthState);
  const currentUserId = auth.currentUser?.$id;
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unsubscribeRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (auth.loading) {
      return;
    }

    if (!auth.currentUser) {
      dispatch(clearLikeData());
      dispatch(clearFriendData());
      dispatch(clearMoviesByGenre());
      dispatch(resetSearchState());
      dispatch(setSearchActive(false));
      dispatch(setSearchTerm(""));
      return;
    }

    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const usersCollectionId =
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID;
    const friendRequestsCollectionId =
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_FRIENDREQUEST_ID;

    if (auth.profileCompleted) {
      dispatch(fetchLikedMovies());
      dispatch(fetchWatchedMovies());
      dispatch(fetchFriendRequests());
      dispatch(fetchFriends());
    }

    if (databaseId && usersCollectionId && currentUserId) {
      databases
        .updateDocument(databaseId, usersCollectionId, currentUserId, {
          status: true,
          lastSeen: getTimestamp(),
        })
        .catch((error) => console.error("Failed to mark user online:", error));

      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }

      heartbeatRef.current = setInterval(() => {
        databases
          .updateDocument(databaseId, usersCollectionId, currentUserId, {
            status: true,
            lastSeen: getTimestamp(),
          })
          .catch((error) => console.error("Heartbeat update failed:", error));
      }, 50000);
    }

    if (
      databaseId &&
      friendRequestsCollectionId &&
      currentUserId &&
      !unsubscribeRef.current
    ) {
      unsubscribeRef.current = client.subscribe(
        `databases.${databaseId}.collections.${friendRequestsCollectionId}.documents`,
        (response: { events: string[]; payload: FriendRequestPayload }) => {
          const { events, payload } = response;
          const isRelevant =
            payload.senderId === currentUserId ||
            payload.receiverId === currentUserId;

          if (!isRelevant) {
            return;
          }

          if (
            events.includes(
              `databases.${databaseId}.collections.${friendRequestsCollectionId}.documents.*.create`,
            )
          ) {
            dispatch(friendRequestCreated(payload));
          } else if (
            events.includes(
              `databases.${databaseId}.collections.${friendRequestsCollectionId}.documents.*.update`,
            )
          ) {
            dispatch(friendRequestUpdated(payload));
            if (payload.status === "accepted") {
              dispatch(fetchFriends());
            }
          } else if (
            events.includes(
              `databases.${databaseId}.collections.${friendRequestsCollectionId}.documents.*.delete`,
            )
          ) {
            dispatch(friendRequestDeleted(payload.$id));
          }
        },
      );
    }

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      if (databaseId && usersCollectionId && currentUserId) {
        databases
          .updateDocument(databaseId, usersCollectionId, currentUserId, {
            status: false,
            lastSeen: getTimestamp(),
          })
          .catch((error) =>
            console.error("Failed to mark user offline:", error),
          );
      }
    };
  }, [
    auth.loading,
    auth.currentUser,
    auth.profileCompleted,
    currentUserId,
    dispatch,
  ]);

  if (auth.loading) {
    return (
      <div className="w-screen h-screen">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}
