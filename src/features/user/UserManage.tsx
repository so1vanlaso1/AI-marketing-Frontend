"use client"
import React, { useEffect } from "react";
import { selectAllUsers } from "./userSlice";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/lib/hooks";
import { getUsersData } from "./userSlice";
export const UserList = () => {
    const users =  useAppSelector(selectAllUsers);
    const dispatch = useAppDispatch();
    useEffect(() => {
        // Dispatch the thunk to fetch users when the component mounts
        dispatch(getUsersData());
    }, [dispatch]);



    let renderedUsers : React.ReactNode;

    if (users.length === 0) {
        renderedUsers = <p>No users found.</p>;
    } else {
        renderedUsers = users.map((user) => (
            <div key={user.userId} className="border p-4 mb-2 rounded-lg shadow-sm">
                <p><strong>ID:</strong> {user.userId}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        ));
    }
    return (
        <div>
            <h2>User List</h2>
            {renderedUsers}
        </div>
    );
}



