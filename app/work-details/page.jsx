"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowForwardIos,
  Edit,
  Favorite,
  FavoriteBorder,
  ArrowBackIosNew,
  ShoppingCart,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";

const WorkDetails = () => {
  const [loading, setLoading] = useState(true);
  const [work, setWork] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [visiblePhotos, setVisiblePhotos] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: session, update } = useSession();
  const userId = session?.user?._id;

  const router = useRouter();
  const searchParams = router.query;
  const workId = searchParams?.id;

  useEffect(() => {
    const getWorkDetails = async () => {
      try {
        if (!workId) {
          console.error("Work ID is undefined");
          // Handle this case, e.g., redirect to an error page
          return;
        }

        const response = await fetch(`api/work/${workId}`);
        const data = await response.json();
        setWork(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching work details", error);
        // Handle error state or redirect to an error page
      }
    };

    getWorkDetails();
  }, [workId]);

  const goToNextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % work.workPhotoPaths.length
    );
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + work.workPhotoPaths.length) %
        work.workPhotoPaths.length
    );
  };

  const loadMorePhotos = () => {
    setVisiblePhotos(work.workPhotoPaths.length);
  };

  const handleSelectedPhoto = (index) => {
    setSelectedPhoto(index);
    setCurrentIndex(index);
  };

  const patchWishlist = async () => {
    try {
      const response = await fetch(`api/user/${userId}/wishlist/${work._id}`, {
        method: "PATCH",
      });
      const data = await response.json();
      update({ user: { wishlist: data.wishlist } });
    } catch (error) {
      console.error("Error patching wishlist", error);
      // Handle error state or show a notification
    }
  };

  const addToCart = async () => {
    const newCartItem = {
      workId,
      image: work.workPhotoPaths[0],
      title: work.title,
      category: work.category,
      creator: work.creator,
      price: work.price,
      quantity: 1,
    };

    if (!session?.user?.cart?.find((item) => item?.workId === workId)) {
      try {
        const newCart = [...session?.user?.cart, newCartItem];
        await fetch(`/api/user/${userId}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: newCart }),
        });
        update({ user: { cart: newCart } });
      } catch (error) {
        console.error("Error adding to cart", error);
        // Handle error state or show a notification
      }
    } else {
      alert("This item is already in your cart");
    }
  };

  return (
    <>
      <Navbar />
      <div className="work-details">
        {loading ? <Loader /> : <>{/* Rest of the component */}</>}
      </div>
    </>
  );
};

export default WorkDetails;

