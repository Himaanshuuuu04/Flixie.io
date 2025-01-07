import { useContext, createContext, useState, useEffect } from "react";
import { databases, ID, Query, client } from "../Appwrite/Config";
import { useAuthContext } from "./AuthContext";

const FriendContext = createContext();
export const useFriendContext = () => useContext(FriendContext);

export const FriendProvider = ({ children }) => {
    const { currentUser } = useAuthContext();
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
    const [friends, setFriends] = useState([]);

    const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID;
    const FRIEND_REQUESTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_FRIENDREQUEST_ID;
    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

    useEffect(() => {
        if (!currentUser) return;

        fetchFriendRequests();
        fetchFriends();

        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${FRIEND_REQUESTS_COLLECTION_ID}.documents`,
            (response) => handleRealTimeEvent(response)
        );
        console.log("Subscribed to real-time updates for friend requests.");

        return () => unsubscribe();
    }, [currentUser]);

    const handleRealTimeEvent = (response) => {
        console.log("Received real-time event:", response);
        const { events, payload } = response;
        const isRelevant = payload.senderId === currentUser.$id || payload.receiverId === currentUser.$id;
    
        if (!isRelevant) {
            console.log("Ignoring real-time event as it is not relevant to the current user.");
            return;
        }
    
        // When a request is created (new request received)
        if (events.includes(`databases.${DATABASE_ID}.collections.${FRIEND_REQUESTS_COLLECTION_ID}.documents.*.create`)) {
            console.log("Real-time event is a new friend request.");
            // Add new request directly without fetching all
            setFriendRequests((prev) => [...prev, payload]);
        } 
        // When a request is updated (accepted or declined)
        else if (events.includes(`databases.${DATABASE_ID}.collections.${FRIEND_REQUESTS_COLLECTION_ID}.documents.*.update`)) {
            console.log("Real-time event is an update to a friend request.");
            // Update the friend requests state when status changes
            setFriendRequests((prev) =>
                prev.map((req) =>
                    req.$id === payload.$id ? { ...req, status: payload.status } : req
                )
            );
    
            // If the request was accepted, add the user to the friends list
            if (payload.status === "accepted") {
                console.log("Friend request was accepted, refetching friends list.");
                fetchFriends();  // Re-fetch friends list when a request is accepted
                // Optionally remove from the friend requests list (for immediate visual update)
                setFriendRequests((prev) => prev.filter((req) => req.$id !== payload.$id));
            }
        } 
        // When a request is deleted (friend request removed)
        else if (events.includes(`databases.${DATABASE_ID}.collections.${FRIEND_REQUESTS_COLLECTION_ID}.documents.*.delete`)) {
            console.log("Real-time event is a deleted friend request.");
            // Remove the deleted request from the list
            setFriendRequests((prev) => prev.filter((req) => req.$id !== payload.$id));
        }
    };
    
    

    const fetchFriendRequests = async () => {
        try {
            setUserLoading(true);
            const response = await databases.listDocuments(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                [Query.equal("receiverId", currentUser.$id), Query.equal("status", "pending")]
            );
            setFriendRequests(response.documents);
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        } finally {
            setUserLoading(false);
        }
    };

    const fetchFriends = async () => {
        try {
            const [sentRequests, receivedRequests] = await Promise.all([
                databases.listDocuments(DATABASE_ID, FRIEND_REQUESTS_COLLECTION_ID, [
                    Query.equal("status", "accepted"),
                    Query.equal("senderId", currentUser.$id),
                ]),
                databases.listDocuments(DATABASE_ID, FRIEND_REQUESTS_COLLECTION_ID, [
                    Query.equal("status", "accepted"),
                    Query.equal("receiverId", currentUser.$id),
                ]),
            ]);
    
            const friendsIds = [
                ...sentRequests.documents.map((req) => req.receiverId),
                ...receivedRequests.documents.map((req) => req.senderId),
            ];
    
            const friendsDetails = await Promise.all(
                friendsIds.map((friendId) =>
                    databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, friendId)
                )
            );
            setFriends(friendsDetails);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };
    

    const searchUsers = async (queryString) => {
        if (userLoading) return;
        setUserLoading(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.search("fullName", queryString)]
            );
            setSearchedUsers(response.documents);
        } catch (error) {
            if (payload.status === "accepted") fetchFriends();
            else if (events.includes("databases.*.collections.*.documents.delete")) {
            setFriendRequests((prev) => prev.filter ((req) => req.$id !== payload.$id));
            }           
            console.error("Error searching users:", error);
    
        } finally {
            setUserLoading(false);
        }
    };

    const sendFriendRequest = async (receiverId) => {
        if (userLoading) return;
        setUserLoading(true);
        try {
            await databases.createDocument(DATABASE_ID, FRIEND_REQUESTS_COLLECTION_ID, ID.unique(), {
                senderId: currentUser.$id,
                receiverId,
                status: "pending",
            });
        } catch (error) {
            console.error("Error sending friend request:", error);
        } finally {
            setUserLoading(false);
        }
    };

    const handleFriendRequest = async (requestId, action) => {
        if (userLoading) return;
        setUserLoading(true);
        try {
            const updatedStatus = action === "accept" ? "accepted" : "declined";
            await databases.updateDocument(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                requestId,
                { status: updatedStatus }
            );
        } catch (error) {
            console.error("Error handling friend request:", error);
        } finally {
            setUserLoading(false);
        }
    };

    const removeFriend = async (friendId) => {
        if (userLoading) return;
        setUserLoading(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
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
                ]
            );

            if (response.total > 0) {
                await databases.deleteDocument(DATABASE_ID, FRIEND_REQUESTS_COLLECTION_ID, response.documents[0].$id);
                setFriends((prev) => prev.filter((friend) => friend.$id !== friendId));
            }
        } catch (error) {
            console.error("Error removing friend:", error);
        } finally {
            setUserLoading(false);
        }
    };

    return (
        <FriendContext.Provider
            value={{
                searchedUsers,
                friendRequests,
                userLoading,
                searchUsers,
                sendFriendRequest,
                handleFriendRequest,
                friends,
                removeFriend,
                setSearchedUsers
            }}
        >
            {children}
        </FriendContext.Provider>
    );
};
