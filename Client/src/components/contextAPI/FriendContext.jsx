import { useContext, createContext, useState, useEffect } from "react";
const FriendContext = createContext();
import { databases, ID, Query, client } from "../Appwrite/Config";
import { useAuthContext } from "./AuthContext";

export const useFriendContext = () => useContext(FriendContext);

export const FriendProvider = ({ children }) => {
    const { currentUser } = useAuthContext();
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]); // To store real-time friend requests
    const [userLoading, setUserLoading] = useState(false);
    const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID;
    const FRIEND_REQUESTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_FRIENDREQUEST_ID;
    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

    useEffect(() => {
        if (!currentUser) return;

        // Subscribe to real-time updates for friend requests involving the current user
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${FRIEND_REQUESTS_COLLECTION_ID}.documents`,
            (response) => {
                const event = response.events[0];
                const payload = response.payload;

                // Check if the update involves the current user
                if (payload.sender_id === currentUser.$id || payload.receiver_id === currentUser.$id) {
                    if (event.includes("create")) {
                        console.log("New friend request received:", payload);
                        setFriendRequests((prev) => [...prev, payload]);
                    } else if (event.includes("update")) {
                        console.log("Friend request updated:", payload);
                        setFriendRequests((prev) =>
                            prev.map((req) =>
                                req.$id === payload.$id ? { ...req, status: payload.status } : req
                            )
                        );
                    }
                }
            }
        );

        return () => unsubscribe(); // Clean up subscription when component unmounts
    }, [currentUser]);

    async function searchUsers(queryString) {
        if (userLoading) return;
        setUserLoading(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.search("fullName", queryString)] // or 'email'
            );
            setSearchedUsers(response.documents);
            console.log("Searched users:", response.documents); // List of matched users
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setUserLoading(false);
        }
    }

    async function sendFriendRequest(receiverId) {
        if (userLoading) return;
        setUserLoading(true);
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                ID.unique(), // Auto-generate a unique ID
                {
                    sender_id: currentUser.$id,
                    receiver_id: receiverId,
                    status: "pending",
                }
            );
            console.log("Friend request sent:", response);
        } catch (error) {
            console.error("Error sending friend request:", error);
        } finally {
            setUserLoading(false);
        }
    }

    async function handleFriendRequest(requestId, action) {
        if (userLoading) return;
        setUserLoading(true);
        try {
            const updatedStatus = action === "accept" ? "accepted" : "declined";
            const response = await databases.updateDocument(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                requestId,
                { status: updatedStatus }
            );
            console.log(`Friend request ${action}ed successfully:`, response);
        } catch (error) {
            console.error("Error handling friend request:", error);
        } finally {
            setUserLoading(false);
        }
    }

    return (
        <FriendContext.Provider
            value={{
                searchedUsers,
                friendRequests,
                userLoading,
                searchUsers,
                sendFriendRequest,
                handleFriendRequest,
            }}
        >
            {children}
        </FriendContext.Provider>
    );
};
