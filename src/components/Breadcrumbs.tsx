import { Button } from "./Button";

interface BreadcrumbsProps {
  title: string;
  children?: React.ReactNode;
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  return (
    <div
      className="row wrapper border-bottom white-bg page-heading m-1"
      style={{ borderRadius: "30px" }}
    >
      <div className="col-sm-4">
        <h2>{props.title}</h2>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Button text="Inicio" route="/dashboard" />
          </li>
          <li className="breadcrumb-item active">
            <strong>{props.title}</strong>
          </li>
        </ol>
      </div>
      <div className="col-sm-8">
        <div className="title-action">{props.children}</div>
      </div>
    </div>
  );
};
