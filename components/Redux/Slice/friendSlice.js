import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, ID, Query } from "../../Appwrite/Config";

const initialState = {
  searchedUsers: [],
  friendRequests: [],
  friends: [],
  userLoading: false,
  error: null,
};

const getIds = () => {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const usersCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID;
  const requestsCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_FRIENDREQUEST_ID;

  if (!databaseId || !usersCollectionId || !requestsCollectionId) {
    throw new Error("Missing Appwrite friend configuration");
  }

  return { databaseId, usersCollectionId, requestsCollectionId };
};

const getCurrentUser = (state) => state.auth.currentUser;

export const fetchFriendRequests = createAsyncThunk(
  "friend/fetchFriendRequests",
  async (_, { getState, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser(getState());
      if (!currentUser) return [];

      const { databaseId, requestsCollectionId } = getIds();
      const response = await databases.listDocuments(
        databaseId,
        requestsCollectionId,
        [
          Query.equal("receiverId", currentUser.$id),
          Query.equal("status", "pending"),
        ],
      );

      return response.documents || [];
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load friend requests");
    }
  },
);

export const fetchFriends = createAsyncThunk(
  "friend/fetchFriends",
  async (_, { getState, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser(getState());
      if (!currentUser) return [];

      const { databaseId, requestsCollectionId, usersCollectionId } = getIds();
      const [sentRequests, receivedRequests] = await Promise.all([
        databases.listDocuments(databaseId, requestsCollectionId, [
          Query.equal("status", "accepted"),
          Query.equal("senderId", currentUser.$id),
        ]),
        databases.listDocuments(databaseId, requestsCollectionId, [
          Query.equal("status", "accepted"),
          Query.equal("receiverId", currentUser.$id),
        ]),
      ]);

      const friendIds = [
        ...sentRequests.documents.map((request) => request.receiverId),
        ...receivedRequests.documents.map((request) => request.senderId),
      ];

      const friends = await Promise.all(
        friendIds.map((friendId) =>
          databases.getDocument(databaseId, usersCollectionId, friendId),
        ),
      );

      return friends;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load friends");
    }
  },
);

export const searchUsers = createAsyncThunk(
  "friend/searchUsers",
  async (queryString, { rejectWithValue }) => {
    try {
      const { databaseId, usersCollectionId } = getIds();
      const response = await databases.listDocuments(
        databaseId,
        usersCollectionId,
        [Query.search("fullName", queryString)],
      );
      return response.documents || [];
    } catch (error) {
      return rejectWithValue(error.message || "Unable to search users");
    }
  },
);

export const sendFriendRequest = createAsyncThunk(
  "friend/sendFriendRequest",
  async (receiverId, { getState, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser(getState());
      if (!currentUser) {
        throw new Error("User is not logged in");
      }

      const { databaseId, requestsCollectionId } = getIds();
      const request = await databases.createDocument(
        databaseId,
        requestsCollectionId,
        ID.unique(),
        {
          senderId: currentUser.$id,
          receiverId,
          status: "pending",
        },
      );

      return request;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to send friend request");
    }
  },
);

export const handleFriendRequest = createAsyncThunk(
  "friend/handleFriendRequest",
  async ({ requestId, action }, { getState, dispatch, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser(getState());
      if (!currentUser) {
        throw new Error("User is not logged in");
      }

      const updatedStatus = action === "accept" ? "accepted" : "declined";
      const { databaseId, requestsCollectionId } = getIds();

      const updatedRequest = await databases.updateDocument(
        databaseId,
        requestsCollectionId,
        requestId,
        { status: updatedStatus },
      );

      if (updatedStatus === "accepted") {
        dispatch(fetchFriends());
      }

      return { ...updatedRequest, status: updatedStatus };
    } catch (error) {
      return rejectWithValue(
        error.message || "Unable to handle friend request",
      );
    }
  },
);

export const removeFriend = createAsyncThunk(
  "friend/removeFriend",
  async (friendId, { getState, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser(getState());
      if (!currentUser) {
        throw new Error("User is not logged in");
      }

      const { databaseId, requestsCollectionId } = getIds();
      const response = await databases.listDocuments(
        databaseId,
        requestsCollectionId,
        [
          Query.equal("status", "accepted"),
          Query.or([
            Query.and([
              Query.equal("senderId", currentUser.$id),
              Query.equal("receiverId", friendId),
            ]),
            Query.and([
              Query.equal("senderId", friendId),
              Query.equal("receiverId", currentUser.$id),
            ]),
          ]),
        ],
      );

      if (response.total > 0) {
        await databases.deleteDocument(
          databaseId,
          requestsCollectionId,
          response.documents[0].$id,
        );
      }

      return friendId;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to remove friend");
    }
  },
);

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    clearFriendData: (state) => {
      state.searchedUsers = [];
      state.friendRequests = [];
      state.friends = [];
      state.error = null;
    },
    clearSearchedUsers: (state) => {
      state.searchedUsers = [];
    },
    friendRequestCreated: (state, action) => {
      const exists = state.friendRequests.some(
        (request) => request.$id === action.payload.$id,
      );
      if (!exists) {
        state.friendRequests.push(action.payload);
      }
    },
    friendRequestUpdated: (state, action) => {
      const request = action.payload;
      state.friendRequests = state.friendRequests
        .map((item) =>
          item.$id === request.$id ? { ...item, ...request } : item,
        )
        .filter((item) => item.status === "pending");
    },
    friendRequestDeleted: (state, action) => {
      state.friendRequests = state.friendRequests.filter(
        (request) => request.$id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendRequests.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.userLoading = false;
        state.friendRequests = action.payload;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchFriends.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.userLoading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(searchUsers.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.userLoading = false;
        state.searchedUsers = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(handleFriendRequest.fulfilled, (state, action) => {
        state.friendRequests = state.friendRequests
          .map((request) =>
            request.$id === action.payload.$id
              ? { ...request, status: action.payload.status }
              : request,
          )
          .filter((request) => request.status === "pending");
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.friends = state.friends.filter(
          (friend) => friend.$id !== action.payload,
        );
      });
  },
});

export const {
  clearFriendData,
  clearSearchedUsers,
  friendRequestCreated,
  friendRequestUpdated,
  friendRequestDeleted,
} = friendSlice.actions;
export default friendSlice.reducer;
