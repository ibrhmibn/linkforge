import { cn } from "@/lib/utils";

const ACCENTS = {
  red: { shadow: "shadow-hard-red", title: "bg-arcade-red text-white" },
  yellow: { shadow: "shadow-hard-yellow", title: "bg-arcade-yellow text-arcade-bg" },
  white: { shadow: "shadow-hard-white", title: "bg-white text-arcade-bg" },
};

export default function ArcadeCard({
  title,
  accent = "red",
  isButton = false, 
  children,
  className,
  ...props
}) {
  const a = ACCENTS[accent] ?? ACCENTS.red;

  return (
    <section
      className={cn(
        "border-4 border-white bg-arcade-bg", 
        a.shadow, 
        isButton ? "rounded-xl flex items-center justify-between px-4 py-3" : "",
        className
      )}
      {...props}
    >
      {title && !isButton && (
        <header
          className={cn(
            "border-b-4 border-white px-4 py-3 font-pixel text-xs uppercase",
            a.title
          )}
        >
          {title}
        </header>
      )}
      
      {isButton ? (
        <div className="w-full flex items-center justify-between">
          {children}
        </div>
      ) : (
        <div className="p-4 sm:p-5">{children}</div>
      )}
    </section>
  );
}