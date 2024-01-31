"use client";

import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import WorkList from "@components/WorkList";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import "@styles/Search.scss";

const SearchPage = () => {
  const { query } = useParams();

  const [loading, setLoading] = useState(true);
  const [workList, setWorkList] = useState([]);

  const getWorkList = async () => {
    try {
      const response = await fetch(`/api/work/search/${query}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const { data } = await response.json();
      setWorkList(data);
    } catch (err) {
      console.error(err);
      // Handle error state, display an error message, or redirect to an error page
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkList();
  }, [query]);

  return (
    <>
      <Navbar />

      <div className="search-page">
        <h1 className="title-list">{query} result(s)</h1>

        {loading ? <Loader /> : <WorkList data={workList} />}
      </div>
    </>
  );
};

export default SearchPage;
