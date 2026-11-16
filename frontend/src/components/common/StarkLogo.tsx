import React from "react";

interface StarkLogoProps {
  variant?: "light" | "dark";
  size?: number;
  className?: string;
  alt?: string;
}

export function StarkLogo({
  variant = "light",
  size = 36,
  className = "",
  alt = "STARK Logo",
}: StarkLogoProps) {
  const src = variant === "dark" ? "/stark-logo-dark.png" : "/stark-logo.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain shrink-0 ${className}`}
      loading="eager"
    />
  );
}

export default StarkLogo;
