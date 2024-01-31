"use client"

import React, { useState } from 'react'
import Form from '@components/Form'
import Navbar from '@components/Navbar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// ... Other imports ...

const CreateWork = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [work, setWork] = useState({
    creator: session?.user?._id || "",
    category: null,
    title: null,
    description: null,
    price: null,
    photos: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newWorkForm = new FormData();

      for (const [key, value] of Object.entries(work)) {
        // Exclude properties with null or undefined values
        if (value !== null && value !== undefined) {
          newWorkForm.append(key, value);
        }
      }

      work.photos.forEach((photo) => {
        newWorkForm.append("workPhotoPaths", photo);
      });

      const response = await fetch("/api/work/new", {
        method: "POST",
        body: newWorkForm,
      });

      if (response.ok) {
        router.push(`/shop?id=${session?.user?._id}`);
      } else {
        // Handle non-ok responses
        console.error("Failed to create work:", response.statusText);
      }
    } catch (error) {
      console.error("Publish Work failed", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Form
        type="Create"
        work={work}
        setWork={setWork}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default CreateWork;
