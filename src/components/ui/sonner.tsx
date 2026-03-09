import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-foreground group-[.toaster]:text-background group-[.toaster]:border-transparent group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:px-5 group-[.toaster]:py-3 group-[.toaster]:text-sm group-[.toaster]:font-medium",
          description: "group-[.toast]:text-background/70",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:!bg-foreground group-[.toaster]:!text-background",
          error: "group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
