"use client";
import { categories } from "@data";
import { useState, useEffect, useCallback } from "react";
import "@styles/Categories.scss";
import Loader from "./Loader";
import WorkList from "./WorkList";

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workList, setWorkList] = useState([]);

  const getWorkList = useCallback(async () => {
    try {
      const response = await fetch(`/api/work/list/${selectedCategory}`);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      setWorkList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error state or display a user-friendly message
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    getWorkList();
  }, [getWorkList]);

  return (
    <>
      <div className="categories">
        {categories?.map((item) => (
          <p
            key={item}
            className={item === selectedCategory ? "selected" : ""}
            onClick={() => setSelectedCategory(item)}
          >
            {item}
          </p>
        ))}
      </div>

      <div className="content">
        {loading ? <Loader /> : <WorkList data={workList} />}
      </div>
    </>
  );
}
