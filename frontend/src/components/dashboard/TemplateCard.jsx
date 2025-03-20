import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";    
import { useState } from "react";
import CreateContButton from "@/components/dashboard/CreateContainer";
import { Server, Clock, ArrowRight } from "lucide-react";

export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}>
      {items.map((item, idx) => (
        <CreateContButton key={idx} templateDefault={item?.image}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
            <Card>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription cont_price={item.price}>{item.description}</CardDescription>
            </Card>
          </motion.div>
        </CreateContButton>
      ))}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-6 overflow-hidden bg-white",
        "border-2 border-gray-100",
        "transition-all duration-300 ease-in-out",
        "group-hover:border-gray-200 group-hover:shadow-lg",
        "relative z-20",
        className
      )}
    >
      <div className="relative z-50 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Server className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      <h2 className={cn(
        "text-xl font-bold text-gray-800",
        "group-hover:text-gray-900 transition-colors duration-200",
        className
      )}>
        {children}
      </h2>
    </div>
  );
};

export const CardDescription = ({ cont_price, className, children }) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Price Tag */}
      <div className="flex items-center gap-2 mb-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
        <Clock className="w-4 h-4 text-gray-400" />
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-gray-800">${cont_price}</span>
          <span className="text-sm text-gray-500">/hour</span>
        </div>
      </div>

      {/* Description */}
      <p className={cn(
        "text-gray-600 text-sm leading-relaxed mb-6",
        "group-hover:text-gray-700 transition-colors duration-200",
        className
      )}>
        {children}
      </p>

      {/* Action Button */}
      <div className="mt-auto">
        <motion.div
          whileHover={{ x: 5 }}
          className="flex items-center justify-between group/button"
        >
          <span className="text-sm font-medium text-gray-600 group-hover/button:text-gray-800">
            Create Container
          </span>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover/button:text-gray-600" />
        </motion.div>
      </div>

      {/* Features List */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2">
          {['Auto-scaling', '24/7 Support'].map((feature, index) => (
            <div key={index} className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
