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
        // Assuming this is available from context
    } = useFriendContext();
    const { currentUser } = useAuthContext();
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            console.log("Searching for users:", query);
            searchUsers(query);
        }
    };

    const handleSendRequest = (receiverId) => {
        console.log("Sending friend request to:", receiverId);
        sendFriendRequest(receiverId);
    };

    const handleRequestAction = (requestId, action) => {
        console.log(`Handling friend request ${action} for request ID ${requestId}`);
        handleFriendRequest(requestId, action);
    };

    return (
        <div className="text-white p-6">
            <h2 className="md:text-4xl text-2xl font-semibold mb-6 mt-4 text-center">Friends</h2>

            {/* Search Users */}
            <form 
                onSubmit={handleSearch} 
                className="bg-white/5 border border-white/20 backdrop-blur-3xl rounded-2xl shadow-lg p-6 flex flex-col gap-6 w-full md:w-1/2 mb-8 text-white font-light text-center mx-auto"
            >
                <label className="flex flex-col gap-3 w-full">
                    <span className="text-xl font-medium">Find and connect with friends</span>
                    <div className="flex flex-wrap gap-4 items-center w-full">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search users..."
                            className="flex-grow px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20 h-full text-center"
                        />
                        <button
                            type="submit"
                            className="bg-white/30 text-white py-2 px-6 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out min-w-max"
                            disabled={userLoading}
                        >
                            {userLoading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </label>

                {searchedUsers.length > 0 && (
                    <div className="w-full">
                        <ul className="flex flex-col gap-4">
                            {searchedUsers.map((user) => (
                                <li 
                                    key={user.$id} 
                                    className="flex items-center gap-4 p-3 border border-white/20 rounded-lg bg-white/10 shadow-sm"
                                >
                                    <img
                                        src={user.profilePicture}
                                        alt={user.fullName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-grow">
                                        <p className="font-medium text-lg">{user.fullName}</p>
                                        <p className="text-sm text-white/50">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => handleSendRequest(user.$id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition-all duration-300 ease-in-out"
                                        disabled={userLoading}
                                    >
                                        {userLoading ? "Sending..." : "Add Friend"}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>

            {/* Friend Requests */}
            {friendRequests.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-2">Friend Requests</h3>
                    <ul>
                        {friendRequests.map((request) => {
                            if (!request || !request.$id) return null; // Skip undefined or invalid requests
                            console.log("Rendering friend request:", request);
                            console.log("Current user ID:", currentUser);
                            return (
                                <li key={request.$id} className="flex items-center justify-between mb-2 p-2 border rounded">
                                    <div>
                                        <p className="font-medium">
                                            {request.senderId === currentUser.$id
                                                ? "You sent a request to"
                                                : "Request from"}{" "}
                                            {request.receiverId}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Status: {request.status}
                                        </p>
                                    </div>
                                    {request.status === "pending" && (
                                        <div>
                                            <button
                                                onClick={() =>
                                                    handleRequestAction(
                                                        request.$id,
                                                        "accept"
                                                    )
                                                }
                                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                                disabled={userLoading}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRequestAction(
                                                        request.$id,
                                                        "decline"
                                                    )
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}


            {/* Loading State */}
            {userLoading && <p className="text-center text-gray-500">Loading...</p>}
        </div>
    );
}
