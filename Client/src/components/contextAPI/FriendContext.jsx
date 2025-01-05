import { useContext, createContext, useState, useEffect } from "react";
const FriendContext = createContext();
import { databases, ID, Query, client } from "../Appwrite/Config";
import { useAuthContext } from "./AuthContext";

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
        // Subscribe to real-time updates for friend requests
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${FRIEND_REQUESTS_COLLECTION_ID}.documents`,
            (response) => {
                console.log("Real-time event received:", response);
                const { events, payload } = response;
                const isRelevant =
                    payload.senderId === currentUser.$id ||
                    payload.receiverId === currentUser.$id;

                if (isRelevant) {
                    console.log("Relevant event for current user:", payload);
                    if (events.includes("databases.*.collections.*.documents.create")) {
                        console.log("New friend request created:", payload);
                        setFriendRequests((prev) => {
                            if (!prev.find((req) => req.$id === payload.$id)) {
                                return [...prev, payload];
                            }
                            return prev;
                        });
                    } else if (events.includes("databases.*.collections.*.documents.update")) {
                        console.log("Friend request updated:", payload);
                        setFriendRequests((prev) =>
                            prev.map((req) =>
                                req.$id === payload.$id ? { ...req, status: payload.status } : req
                            )
                        );
                    } else if (events.includes("databases.*.collections.*.documents.delete")) {
                        console.log("Friend request deleted:", payload);
                        setFriendRequests((prev) =>
                            prev.filter((req) => req.$id !== payload.$id)
                        );
                    }
                }
            }
        );

        return () => {
            console.log("Unsubscribing from real-time updates...");
            unsubscribe();
        };
    }, [currentUser]);

    async function searchUsers(queryString) {
        if (userLoading) return;
        setUserLoading(true);
        try {
            console.log("Searching users with query:", queryString);
            const response = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.search("fullName", queryString)]
            );
            console.log("Users found:", response.documents);
            setSearchedUsers(response.documents);
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
            console.log("Sending friend request to receiverId:", receiverId);
        ;
            const response = await databases.createDocument(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                ID.unique(),
                {
                    senderId: currentUser.$id,
                    receiverId: receiverId,
                    status: "pending",
                }
            );
            console.log("Friend request sent successfully:", response);
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
            console.log(`Handling friend request (ID: ${requestId}) with action: ${action}`);
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

    async function fetchFriendRequests() {
        if (userLoading) return;
        setUserLoading(true);
        try {
            console.log("Fetching friend requests...");
            const response = await databases.listDocuments(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                [     
                    Query.equal("receiverId", currentUser.$id),
                    Query.equal("status", "pending") 
                ]
            );
            console.log("Friend requests fetched:", response.documents);
            setFriendRequests(response.documents);
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        } finally {
            setUserLoading(false);
        }
    }

    // Fetch friends
    const fetchFriends = async () => {
        console.log('Fetching friends...');
        try {
          // Query friend requests for senderId and receiverId
            const response1 = await databases.listDocuments(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                [
                    Query.equal('status', 'accepted'),
                    Query.equal('senderId', currentUser.$id)
                ]
            );
            console.log('Friend requests with senderId fetched:', response1.documents);
      
            const response2 = await databases.listDocuments( 
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID, 
                [
                    Query.equal('status', 'accepted'),
                    Query.equal('receiverId',currentUser.$id)
                ]
            );
            console.log('Friend requests with receiverId fetched:', response2.documents);
      
            const friendsIds = [
                ...response1.documents.map(request => request.receiverId),
                ...response2.documents.map(request => request.senderId)
            ];
            console.log('Friends IDs:', friendsIds);
      
          // Fetch all friend details in parallel using Promise.all
            const friendsDetailsPromises = friendsIds.map(friendId =>
                databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, friendId)
            );
            console.log('Fetching friend details...');
          
            const friendsDetails = await Promise.all(friendsDetailsPromises);
            console.log( "Friends fetched:", friendsDetails);
            setFriends(friendsDetails);
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
        finally {
          setUserLoading(false);
          console.log('Friends fetched and loading set to false.');
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
                friends
            }}
        >
            {children}
        </FriendContext.Provider>
    );
};
