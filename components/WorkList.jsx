import React from "react";
import PropTypes from "prop-types";
import "@styles/WorkList.scss";
import WorkCard from "./WorkCard";

const WorkList = ({ data }) => {
  return (
    <div className="work-list">
      {data && data.map((work) => <WorkCard key={work._id} work={work} />)}
    </div>
  );
};

WorkList.propTypes = {
  data: PropTypes.array.isRequired,
};

export default WorkList;
