import React from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton component for loading states
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Optional children to render inside the skeleton
 * @param {boolean} props.animate - Whether to animate the skeleton (default: true)
 * @param {string} props.variant - Skeleton variant: "default", "card", "text", "avatar", "button"
 * @param {number} props.width - Width of the skeleton (can be a number or CSS value)
 * @param {number} props.height - Height of the skeleton (can be a number or CSS value)
 * @param {boolean} props.rounded - Whether to apply rounded corners (default: true)
 * @returns {React.ReactElement} Skeleton component
 */
const Skeleton = ({
  className,
  children,
  animate = true,
  variant = "default",
  width,
  height,
  rounded = true,
  ...props
}) => {
  // Base styles for all skeletons
  const baseStyles = "bg-gray-200 dark:bg-gray-700";
  
  // Animation styles
  const animationStyles = animate 
    ? "animate-pulse" 
    : "";
  
  // Rounded styles
  const roundedStyles = rounded 
    ? "rounded-md" 
    : "";
  
  // Variant-specific styles
  const variantStyles = {
    default: "",
    card: "p-4",
    text: "h-4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24",
  };
  
  // Width and height styles
  const dimensionStyles = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };
  
  // Combine all styles
  const combinedClassName = cn(
    baseStyles,
    animationStyles,
    roundedStyles,
    variantStyles[variant],
    className
  );
  
  return (
    <div
      className={combinedClassName}
      style={dimensionStyles}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * SkeletonText component for text loading states
 */
const SkeletonText = ({ lines = 1, className, ...props }) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          className={cn(
            i === lines - 1 && lines > 1 ? "w-4/5" : "w-full",
            className
          )} 
        />
      ))}
    </div>
  );
};

/**
 * SkeletonCard component for card loading states
 */
const SkeletonCard = ({ className, ...props }) => {
  return (
    <div className={cn("p-4 border rounded-lg shadow-sm", className)} {...props}>
      <Skeleton variant="card" className="mb-4" />
      <SkeletonText lines={3} className="mb-4" />
      <div className="flex justify-between">
        <Skeleton variant="button" />
        <Skeleton variant="button" />
      </div>
    </div>
  );
};

/**
 * SkeletonAvatar component for avatar loading states
 */
const SkeletonAvatar = ({ size = "md", className, ...props }) => {
  const sizeStyles = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };
  
  return (
    <Skeleton 
      variant="avatar" 
      className={cn(sizeStyles[size], className)} 
      {...props} 
    />
  );
};

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar }; 