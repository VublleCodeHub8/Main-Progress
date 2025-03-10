import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {Link} from "react-router-dom";    
import { useState } from "react";
import CreateContButton  from  "@/components/dashboard/CreateContainer"

export const HoverEffect = ({
  items,
  className
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    (<div
      className={cn("grid grid-cols-4 py-10", className)}>
      {items.map((item, idx) => (
        <CreateContButton templateDefault = {item?.image}>
        <Link
          href={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}>
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-blue-200 block  rounded-xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }} />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription cont_price={item.price}>{item.description}</CardDescription>
          </Card>
        </Link>
        </CreateContButton>
      ))}
    </div>)
  );
};

export const Card = ({
  className,
  children
}) => {
  return (
    (<div
      className={cn(
        "rounded-xl h-full w-full p-4 overflow-hidden bg-white  border border-transparent group-hover:border-slate-500 relative z-20",
        className
      )}>
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>)
  );
};
export const CardTitle = ({
  className,
  children
}) => {
  return (
    (<h2 className={cn("text-zinc-700 text-2xl font-bold tracking-wide mt-2 ", className)}>
      {children}
    </h2>)
  );
};
export const CardDescription = ({
  cont_price,
  className,
  children
}) => {
  return (

    (<div>
      <h4 className={cn("text-zinc-900 tracking-wide leading-relaxed text-xl", className)}>
        {cont_price}$ /per hour
      </h4>
      <p className={cn("pt-4 text-zinc-900 tracking-wide leading-relaxed text-sm", className)}>
        {children}
      </p>
    </div>)
  );
};
