import React from 'react';
import { cn } from "@/lib/utils";

export const Card = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={cn("rounded-lg border-2 shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className = '', children, ...props }) => {
  return (
    <h3 
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={cn("p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={cn("p-6 pt-0 border-t border-gray-200 dark:border-gray-800", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;