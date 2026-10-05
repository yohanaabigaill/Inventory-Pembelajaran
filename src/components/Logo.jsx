import React from "react";
import logo from "../assets/logo rsq.jpeg";

export default function Logo() {
  return (
    <img
      src={logo}
      alt="RSQ Logo"
      style={{ width: "85px", height: "auto", display: "block" }}
    />
  );
}
