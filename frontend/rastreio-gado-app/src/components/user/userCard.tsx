import React from "react";
import Link from "next/link";
import User from "@/model/user";

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  return (
    <Link href={`/users/${user.id}`} className="block">
      <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{user.name}</h2>
        <p className="text-sm text-gray-600">
          🤡 <span className="font-medium">Id:</span> {user.id}
        </p>
        <p className="text-sm text-gray-600">
          📧 <span className="font-medium">Email:</span> {user.email}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          🕒 <span className="font-medium">Criado em:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}

export default UserCard;
