import { useEffect, useState } from "react";
import { useFriendContext } from "./contextAPI/FriendContext";
import { useAuthContext } from "./contextAPI/AuthContext";

export default function FriendsLogic() {
    const { 
        searchedUsers,
        friendRequests,
        userLoading,
        searchUsers,
        sendFriendRequest,
        handleFriendRequest,
        friends,
        removeFriend,
        setSearchedUsers
    } = useFriendContext();

    const { currentUser } = useAuthContext();
    const [query, setQuery] = useState("");
    const [loadingActions, setLoadingActions] = useState({});

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            console.log("Searching for users:", query);
            searchUsers(query);
        }
    };

    // Handle sending friend request with button disable
    const handleSendRequest = async (receiverId) => {
        if (loadingActions[receiverId]) return; // Prevent duplicate clicks
        setLoadingActions((prev) => ({ ...prev, [receiverId]: true }));

        try {
            console.log("Sending friend request to:", receiverId);
            await sendFriendRequest(receiverId);
        } catch (error) {
            console.error("Error sending request:", error);
        } finally {
            setLoadingActions((prev) => ({ ...prev, [receiverId]: false }));
        }
    };

    // Handle request action (accept/decline)
    const handleRequestAction = async (requestId, action) => {
        if (loadingActions[requestId]) return;
        setLoadingActions((prev) => ({ ...prev, [requestId]: true }));

        try {
            console.log(`Handling friend request ${action} for request ID ${requestId}`);
            await handleFriendRequest(requestId, action);
        } catch (error) {
            console.error("Error handling request:", error);
        } finally {
            setLoadingActions((prev) => ({ ...prev, [requestId]: false }));
        }
    };

    // Handle removing friend
    const handleRemoveFriend = async (friendId) => {
        if (loadingActions[friendId]) return;
        setLoadingActions((prev) => ({ ...prev, [friendId]: true }));

        try {
            console.log("Removing friend with ID:", friendId);
            await removeFriend(friendId);
        } catch (error) {
            console.error("Error removing friend:", error);
        } finally {
            setLoadingActions((prev) => ({ ...prev, [friendId]: false }));
        }
    };

    return (
        <div className="text-white p-6 h-full bg-white/5 border border-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
            <h2 className="md:text-4xl text-2xl font-semibold mb-6 mt-4 text-center">Friends</h2>

            {/* Friends List */}
            < >
            <div className="bg-white/5 border border-white/20 backdrop-blur-3xl rounded-2xl shadow-lg p-6 w-full xl:w-1/2 mb-8 mx-auto text-white font-light">
                <h3 className="text-xl font-semibold mb-4">Friends</h3>
                <ul>
                    {friends.length === 0 ? (
                        <p className="text-white/50">You have no friends yet.</p>
                    ) : (
                        friends.map((friend) => (
                            <li key={friend.$id} className="flex items-center justify-between p-3 border border-white/20 rounded-xl mb-2 bg-white/10">
                                <div className="flex items-center">
                                    <img src={friend.profilePicture} alt={friend.fullName} className="h-10 w-10 rounded-full mr-3 border border-white/50" />
                                    <div>
                                        <p className="font-medium text-xl ">{friend.fullName}</p>
                                        <p className="text-sm text-white/50">{friend.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveFriend(friend.$id)}
                                    disabled={loadingActions[friend.$id]}
                                    className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
                                        loadingActions[friend.$id] ? "bg-white/20" : "bg-red-500 hover:bg-red-400"
                                    }`}
                                >
                                    {loadingActions[friend.$id] ? "Removing..." : "Remove"}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
            </>
            <>
            {/* Search Users */}
            <form onSubmit={handleSearch} className="w-full xl:w-1/2 mb-8 mx-auto">
                <label className="flex flex-col gap-3">
                    <span className="text-xl font-medium">Find and connect with friends</span>
                    <div className="flex gap-4 relative"> {/* Make the parent relative for positioning the cross button */}
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search users..."
                            className="flex-grow px-4 py-2 border border-white/20 rounded-xl focus:outline-none focus:ring focus:ring-white/20 bg-black/20 text-center"
                        />
                        
                        {/* Cross button to clear search results */}
                        {query && (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery('');
                                    setSearchedUsers([]);
                                }} // Clear the query state when clicked
                                className=" bg-red-500 rounded-xl px-3 hover:bg-red-600     text-white "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                    <path d="M11.742 4.758a1 1 0 0 0-1.48-1.32l-3.264 3.265-3.264-3.265a1 1 0 0 0-1.48 1.32l3.265 3.265-3.265 3.263a1 1 0 0 0 1.48 1.32l3.264-3.263 3.264 3.263a1 1 0 0 0 1.48-1.32l-3.265-3.263 3.265-3.265z"/>
                                </svg>
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={userLoading}
                            className="px-6 py-2 rounded-lg font-light border border-white/20 text-white transition-all duration-300 bg-white/20 hover:bg-white/10"
                        >
                            {userLoading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </label>

                {searchedUsers.length > 0 && (
                    <ul className="mt-4">
                        {searchedUsers.map((user) => (
                            <li key={user.$id} className="flex items-center justify-between p-3 border rounded-xl mb-2 bg-white/10">
                                <div className="flex items-center">
                                    <img src={user.profilePicture} alt={user.fullName} className="h-12 w-12 rounded-full mr-3" />
                                    <div>
                                        <p className="font-medium">{user.fullName}</p>
                                        <p className="text-sm text-white/50">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSendRequest(user.$id)}
                                    disabled={loadingActions[user.$id]}
                                    className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
                                        loadingActions[user.$id] ? "bg-gray-400" : "bg-green-500 hover:bg-green-400"
                                    }`}
                                >
                                    {loadingActions[user.$id] ? "Sending..." : "Add Friend"}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </form>


            {/* Friend Requests */}
            
                <div className="bg-white/5 border border-white/20 backdrop-blur-3xl rounded-2xl shadow-lg p-6 w-full xl:w-1/2 mx-auto">
                    <h3 className="text-xl font-semibold mb-4">Friend Requests</h3>
                    <ul>
                        {friendRequests.length === 0 ? (
                            <p className="text-white/50 font-light">You have no friend requests yet.</p>
                        ) : (
                            friendRequests.map((request) => {
                                if (request.receiverId === currentUser.$id && request.status === "pending") {
                                    return (
                                        <li key={request.$id} className="flex items-center justify-between p-3 border rounded-xl mb-2 bg-white/10">
                                            <div>
                                                <p className="font-medium">
                                                    {request.senderId === currentUser.$id ? "You sent a request to" : "Request from"} {request.senderId}
                                                </p>
                                                <p className="text-sm text-white/50">Status: {request.status}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRequestAction(request.$id, "accept")}
                                                    disabled={loadingActions[request.$id]}
                                                    className={`px-3 py-1 rounded text-white transition-all duration-300 ${
                                                        loadingActions[request.$id] ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-400"
                                                    }`}
                                                >
                                                    {loadingActions[request.$id] ? "Accepting..." : "Accept"}
                                                </button>
                                                <button
                                                    onClick={() => handleRequestAction(request.$id, "decline")}
                                                    disabled={loadingActions[request.$id]}
                                                    className={`px-3 py-1 rounded text-white transition-all duration-300 ${
                                                        loadingActions[request.$id] ? "bg-gray-400" : "bg-red-500 hover:bg-red-400"
                                                    }`}
                                                >
                                                    {loadingActions[request.$id] ? "Declining..." : "Decline"}
                                                </button>
                                            </div>
                                        </li>
                                    );
                                }
                            })
                        )}
                    </ul>
                </div>
            </>
        </div>
    );
}
