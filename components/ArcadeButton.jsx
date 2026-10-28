import { cn } from "@/lib/utils";

const VARIANTS = {
  red: "bg-arcade-red text-white shadow-hard-white hover:shadow-hard-yellow",
  yellow: "bg-arcade-yellow text-arcade-bg shadow-hard-red hover:shadow-hard-white",
  dark: "bg-arcade-bg text-white shadow-hard-red hover:shadow-hard-yellow",
};

export default function ArcadeButton({
  children,
  variant = "red",
  href,
  className,
  type = "button",
  as = "button",
  ...props
}) {
  const classes = cn(
    "group relative inline-flex items-center border-4 border-white px-6 py-4 cursor-pointer",
    "font-pixel text-xs uppercase tracking-wide sm:text-sm",
    "transition-[transform,box-shadow] duration-100",
    "hover:-translate-x-0.5 hover:-translate-y-0.5",
    "active:translate-x-1.5 active:translate-y-1.5 active:shadow-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant] ?? VARIANTS.red,
    className
  );

  const content = (
    <>
      <span
        aria-hidden="true"
        className="mr-0 inline-block w-0 overflow-hidden opacity-0 transition-all duration-100 group-hover:mr-2 group-hover:w-[1.2ch] group-hover:opacity-100 group-focus-visible:mr-2 group-focus-visible:w-[1.2ch] group-focus-visible:opacity-100"
      >
        &gt;
      </span>
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  // --- INI BAGIAN YANG DIPERBAIKI ---
  const Component = as;
  
  return (
    <Component 
      type={as === "button" ? type : undefined} 
      className={classes} 
      {...props}
    >
      {content}
    </Component>
  );
}