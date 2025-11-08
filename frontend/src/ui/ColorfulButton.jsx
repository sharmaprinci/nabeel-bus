import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function Button({
  children,
  color = "blue",
  size = "md",
  variant = "solid", // neon | solid | glass | soft | outline | underline
  to,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) {
  const colorMap = {
    blue: {
      base: "text-blue-500 border-blue-500 shadow-blue-500/50 bg-blue-600 hover:bg-blue-700",
      text: "text-blue-500",
      bg: "bg-blue-600",
    },
    pink: {
      base: "text-pink-500 border-pink-500 shadow-pink-500/50 bg-pink-600 hover:bg-pink-700",
      text: "text-pink-500",
      bg: "bg-pink-600",
    },
    green: {
      base: "text-emerald-500 border-emerald-500 shadow-emerald-500/50 bg-emerald-600 hover:bg-emerald-700",
      text: "text-emerald-500",
      bg: "bg-emerald-600",
    },
    orange: {
      base: "text-amber-500 border-amber-500 shadow-amber-500/50 bg-amber-600 hover:bg-amber-700",
      text: "text-amber-500",
      bg: "bg-amber-600",
    },
    red: {
      base: "text-rose-500 border-rose-500 shadow-rose-500/50 bg-rose-600 hover:bg-rose-700",
      text: "text-rose-500",
      bg: "bg-rose-600",
    },
    purple: {
      base: "text-indigo-500 border-indigo-500 shadow-indigo-500/50 bg-indigo-600 hover:bg-indigo-700",
      text: "text-indigo-500",
      bg: "bg-indigo-600",
    },
    indigo: {
  base: "text-indigo-500 border-indigo-500 shadow-indigo-500/50 bg-indigo-600 hover:bg-indigo-700",
  text: "text-indigo-500",
  bg: "bg-indigo-600",
},

  };

  const sizeMap = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-5 py-2.5 text-base rounded-lg",
    lg: "px-7 py-3 text-lg rounded-xl",
  };

  const variantMap = {
    neon: `
      border-2 bg-transparent backdrop-blur-sm font-semibold
      hover:scale-[1.05] hover:shadow-[0_0_20px_var(--tw-shadow-color)]
      ${colorMap[color].text} border-current hover:text-white hover:${colorMap[color].bg}
    `,
    solid: `
      text-white font-semibold ${colorMap[color].bg} hover:opacity-90
      shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-95
    `,
    glass: `
  font-semibold border border-current backdrop-blur-md
  bg-white/10 hover:bg-white/20
  ${colorMap[color].text} hover:scale-[1.05] hover:shadow-[0_0_15px_var(--tw-shadow-color)]
`,

    soft: `
      text-white font-semibold ${colorMap[color].bg}
      shadow-lg shadow-${color}-500/30 hover:opacity-90 hover:scale-[1.05] active:scale-95
    `,
    outline: `
      border-2 font-semibold ${colorMap[color].text} border-current
      hover:${colorMap[color].bg} hover:text-white
      transition-all hover:scale-[1.05]
    `,
    underline: `
      relative font-semibold ${colorMap[color].text} after:content-['']
      after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1
      after:bg-current after:transition-all after:duration-300
      hover:after:w-full hover:text-current
    `,
    gradient: `
  text-white font-semibold 
  bg-gradient-to-r ${color === "blue" ? "from-blue-500 to-indigo-600" : ""}
  ${color === "pink" ? "from-pink-500 to-rose-600" : ""}
  ${color === "green" ? "from-emerald-500 to-green-600" : ""}
  ${color === "orange" ? "from-amber-500 to-orange-600" : ""}
  ${color === "red" ? "from-rose-500 to-red-600" : ""}
  ${color === "purple" ? "from-indigo-500 to-purple-600" : ""}
  shadow-md hover:shadow-lg 
  hover:opacity-90 hover:scale-[1.03] active:scale-95
  transition-all
`,

  };

  const classes = clsx(
    "inline-flex items-center justify-center gap-2 transition-all duration-300 ease-out",
    sizeMap[size],
    variantMap[variant],
    disabled && "opacity-60 cursor-not-allowed",
    className
  );

  // If it's a link
  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
