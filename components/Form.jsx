
import React from "react";
import PropTypes from "prop-types";
import { categories } from "@data";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import "@styles/Form.scss";

const Form = ({ type, work, setWork, handleSubmit }) => {
  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setWork((prevWork) => ({
      ...prevWork,
      photos: [...prevWork.photos, ...newPhotos],
    }));
  };

  const handleRemovePhoto = (indexToRemove) => {
    setWork((prevWork) => ({
      ...prevWork,
      photos: prevWork.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWork((prevWork) => ({
      ...prevWork,
      [name]: value,
    }));
  };

  const handleCategoryClick = (item) => {
    setWork((prevWork) => ({ ...prevWork, category: item }));
  };

  return (
    <div className="form">
      <h1>{type} Your Work</h1>
      <form onSubmit={handleSubmit}>
        <div className="category-list">
          {categories?.map((item, index) => (
            <p
              key={index}
              className={work.category === item ? "selected" : ""}
              onClick={() => handleCategoryClick(item)}
            >
              {item}
            </p>
          ))}
        </div>

        <div className="photos">
          {work.photos.length < 1 && (
            <label htmlFor="image" className="alone">
              <IoIosImages />
              <p>Upload from your device</p>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleUploadPhotos}
                multiple
              />
            </label>
          )}

          {work.photos.length > 0 && (
            <>
              {work?.photos?.map((photo, index) => (
                <div key={index} className="photo">
                  <img
                    src={
                      photo instanceof Object
                        ? URL.createObjectURL(photo)
                        : photo
                    }
                    alt="work"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <BiTrash />
                  </button>
                </div>
              ))}
              <label htmlFor="image" className="together">
                <IoIosImages />
                <p>Upload from your device</p>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadPhotos}
                  multiple
                />
              </label>
            </>
          )}
        </div>

        <div className="description">
          <label>
            <p>Title</p>
            <input
              type="text"
              placeholder="Title"
              onChange={handleChange}
              name="title"
              value={work.title}
              required
            />
          </label>
          <label>
            <p>Description</p>
            <textarea
              type="text"
              placeholder="Description"
              onChange={handleChange}
              name="description"
              value={work.description}
              required
            />
          </label>
          <label>
            <p>Now, set your PRICE</p>
            <span>#</span>
            <input
              type="number"
              placeholder="Price"
              onChange={handleChange}
              name="price"
              value={work.price}
              required
              className="price"
            />
          </label>
        </div>
        <button className="submit-btn" type="submit">
          PUBLISH YOUR WORK
        </button>
      </form>
    </div>
  );
};

Form.propTypes = {
  type: PropTypes.string.isRequired,
  work: PropTypes.object.isRequired,
  setWork: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Form;
