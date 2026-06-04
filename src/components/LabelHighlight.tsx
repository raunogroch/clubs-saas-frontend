export const LabelHighlight = ({
  text,
  type,
  location = "right",
}: {
  text: string;
  type: "primary" | "success" | "info" | "warning" | "danger";
  location?: "left" | "center" | "right";
}) => {
  const locationClasses: Record<string, string> = {
    left: "float-left",
    center: "text-center",
    right: "float-right",
  };

  return (
    <span className={`label label-${type} ${locationClasses[location]}  mx-1`}>
      {text}
    </span>
  );
};
