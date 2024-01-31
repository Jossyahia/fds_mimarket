"use client";

import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import WorkList from "@components/WorkList";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "@styles/Shop.scss";

const Shop = () => {
  const { data: session } = useSession();
  const loggedInUserId = session?.user?._id || null;

  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [workList, setWorkList] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const getWorkList = async () => {
      try {
        const response = await fetch(`api/user/${profileId}/shop`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setWorkList(data.workList);
        setProfile(data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching work list", error);
        // Handle error state or redirect to an error page
        setLoading(false);
      }
    };

    if (profileId) {
      getWorkList();
    }
  }, [profileId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">
        {loggedInUserId === profileId
          ? "Your Works"
          : `${profile.username}'s Works`}
      </h1>
      <WorkList data={workList} />
    </>
  );
};

export default Shop;
