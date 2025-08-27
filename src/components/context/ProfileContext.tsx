import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface ProfileData {
  _id?: string;
  name?: string;
  institution?: string;
  bio?: string;
  profileImage?: string;
  skills?: { skillName: string; level: string; endorsements: number }[];
  experiences?: { role: string; company: string; location: string; dateRange: string }[];
  interests?: string[];
  endorsements?: { reviewerName: string; reviewerRole: string; skills: string[]; rating: number }[];
  competitions?: { title: string; category: string; result: string; dateRange: string }[];
  feedbacks?: { reviewerName: string; reviewerRole: string; text: string; mediaUrl: string; rating: number }[];
  highlights?: { label: string; value: number }[];
}

interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType>({ profile: null, loading: true });

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
