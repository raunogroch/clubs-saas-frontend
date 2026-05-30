import { Button } from "./Button";

interface BeadcumbsProps {
  title: string;
}

export const Beadcumbs = (props: BeadcumbsProps) => {
  return (
    <div className="row wrapper border-bottom white-bg page-heading">
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
        <div className="title-action">
          <Button className="btn btn-primary" text="This is action area" />
        </div>
      </div>
    </div>
  );
};
