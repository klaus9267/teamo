import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handlePostNew = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsOpen(true);
    } else {
      navigate("/posts/new");
    }
  };

  return <></>;
}
