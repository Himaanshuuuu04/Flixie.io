import { useEffect, useState } from "react";
import { useFriendContext } from "./contextAPI/FriendContext";

export default function FriendsLogic() {
    const { 
        searchedUsers,
        friendRequests,
        userLoading,
        searchUsers,
        sendFriendRequest,
        handleFriendRequest,
    } = useFriendContext();

    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) searchUsers(query);
    };

    const handleSendRequest = (receiverId) => {
        sendFriendRequest(null, receiverId);
    };

    const handleRequestAction = (requestId, action) => {
        handleFriendRequest(requestId, action);
    };

    return (
        <div className=" text-white">
            <h2 className="md:text-4xl text-2xl text-white font-semibold mb-4 mt-4">Friends</h2>

            {/* Search Users */}
            <form 
                onSubmit={handleSearch} 
                className="bg-white/5 border border-white/20 backdrop-blur-3xl rounded-2xl shadow-lg p-6 flex flex-col gap-6 w-full md:w-1/2 mb-5 text-white font-light text-center mx-auto"
            >
                {/* Search Section */}
                <label className="flex flex-col gap-3 w-full">
                    <span className="text-xl font-medium">Find and connect with friends</span>
                    <div className="flex flex-wrap gap-4 items-center w-full ">
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

                {/* Searched Users Section */}
                {searchedUsers.length > 0 && (
                    <div className="w-full">
                        <ul className="flex flex-col gap-4">
                            {searchedUsers.map((user) => (
                                <li 
                                    key={user.$id} 
                                    className="flex items-center gap-4 p-3 border border-white/20 rounded-lg bg-white/10 shadow-sm"
                                >
                                    {/* Profile Picture */}
                                    <img
                                        src={user.profilePicture}
                                        alt={user.fullName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {/* User Info */}
                                    <div className="flex-grow">
                                        <p className="font-medium text-lg">{user.fullName}</p>
                                        <p className="text-sm text-white/50">{user.email}</p>
                                    </div>
                                    {/* Add Friend Button */}
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


            

            {/* Friend Requests List */}
            {friendRequests.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-2">Friend Requests</h3>
                    <ul>
                        {friendRequests.map((request) => (
                            <li key={request.$id} className="flex items-center justify-between mb-2 p-2 border rounded">
                                <div>
                                    <p className="font-medium">
                                        {request.sender_id === currentUser.$id
                                            ? "You sent a request to"
                                            : "Request from"}{" "}
                                        {request.receiver_id}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Status: {request.status}
                                    </p>
                                </div>
                                {request.status === "pending" && (
                                    <div>
                                        <button
                                            onClick={() => handleRequestAction(request.$id, "accept")}
                                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                            disabled={userLoading}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleRequestAction(request.$id, "decline")}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            disabled={userLoading}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Loading State */}
            {userLoading && <p className="text-center text-gray-500">Loading...</p>}
        </div>
    );
}
