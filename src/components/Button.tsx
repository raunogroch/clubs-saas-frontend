import { Link } from "react-router";

interface IconProps {
  icon: string;
}

interface ButtonProps {
  text: string;
  className?: string;
  icon?: IconProps;
  route?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  text,
  className,
  icon,
  route,
  onClick,
  type = "button",
}: ButtonProps) => {
  const content = (
    <>
      {icon && <i className={icon.icon}></i>}
      <span>{text}</span>
    </>
  );

  if (route) {
    return (
      <Link className={className} to={route}>
        {content}
      </Link>
    );
  }

  return (
    <Link className={className} onClick={onClick} type={type} to="#">
      {content}
    </Link>
  );
};
