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
    
        async function fetchFriendRequests() {
            if(userLoading) return;
            setUserLoading(true);
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    FRIEND_REQUESTS_COLLECTION_ID,
                    [
                        Query.or([
                            Query.equal("senderId", currentUser.$id),
                            Query.equal("receiverId", currentUser.$id)
                        ])
                    ]
                );
                
                setFriendRequests(response.documents);
                console.log("Fetched existing friend requests:", response.documents);
            } catch (error) {
                console.error("Error fetching friend requests:", error);
            } finally {
                setUserLoading(false);
            }
        }
    
        fetchFriendRequests();
    
        // Subscribe to real-time updates for friend requests
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${FRIEND_REQUESTS_COLLECTION_ID}.documents`,
            (response) => {
                const { events, payload } = response;
                console.log(currentUser.$id);
                // Check if the event involves the current user
                if (
                    payload.senderId === currentUser.$id ||
                    payload.receiverId === currentUser.$id
                ) {
                    if (events.includes("databases.*.collections.*.documents.create")) {
                        console.log("New friend request received:", payload);
                        setFriendRequests((prev) => [...prev, payload]);
                    } else if (events.includes("databases.*.collections.*.documents.update")) {
                        console.log("Friend request updated:", payload);
                        setFriendRequests((prev) =>
                            prev.map((req) =>
                                req.$id === payload.$id
                                    ? { ...req, status: payload.status }
                                    : req
                            )
                        );
                    }
                }
            }
        );
    
        // Cleanup function to unsubscribe on unmount
        return () => unsubscribe();
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
                (receiverId+currentUser.$id).slice(0, 36), // Auto-generate a unique ID with a maximum length of 20
                {
                    senderId: currentUser.$id,
                    receiverId: receiverId,
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
