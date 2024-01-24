"use client";
import { categories } from "@data";
import { useState, useEffect } from "react";
import "@styles/Categories.scss";
import Loader from "./Loader";
import WorkList from "./WorkList";

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workList, setWorkList] = useState([]);

  useEffect(() => {
    getWorkList();
  }, [selectedCategory]);

  const getWorkList = async () => {
    const response = await fetch(`/api/work/list/${selectedCategory}`);
    const data = await response.json();
    setWorkList(data);
    setLoading(false);
  };

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

      {loading ? <Loader /> : <WorkList data={workList} />}
    </>
  );
}
