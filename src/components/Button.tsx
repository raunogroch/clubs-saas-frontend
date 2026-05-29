import { Link } from "react-router";

interface ButtonProps {
  text: string;
  className?: string;
  icon?: IconProps;
  route?: string;
}

interface IconProps {
  icon: string;
}
export const Button = (props: ButtonProps) => {
  return (
    <Link className={`${props.className}`} to={props.route || "#"}>
      {props.icon ? (
        <>
          <i className={`${props.icon.icon}`}></i>
          <>{props.text}</>
        </>
      ) : (
        <>{props.text}</>
      )}
    </Link>
  );
};
