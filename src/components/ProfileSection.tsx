import React from "react";
import { useProfile } from "./context/ProfileContext";
import bgImage from "../assets/bg.png"; // your static banner image

const ProfileSection: React.FC = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <section className="bg-white rounded-2xl shadow p-6 flex justify-center items-center">
        <p className="text-gray-500">Loading profile...</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="bg-white rounded-2xl shadow p-6 flex justify-center items-center">
        <p className="text-gray-500">No profile data found.</p>
      </section>
    );
  }

  return (
    <section className="relative w-full rounded-2xl shadow overflow-hidden">
      {/* Background Banner */}
      <div
        className="h-48 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      {/* Profile Content */}
      <div className="relative flex flex-col items-center -mt-16 px-6 pb-6">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {profile.name || "Unknown User"}
          </h2>
          <p className="text-gray-600">{profile.institution || "No institution added"}</p>
          <p className="mt-2 text-gray-700 max-w-2xl">
            {profile.bio || "No bio available"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
