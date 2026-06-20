import { Button } from "./Button";

interface BreadcumbItem {
  label: string;
  route?: string;
}

interface BreadcumbsProps {
  title: string;
  items?: BreadcumbItem[];
  children?: React.ReactNode;
}

export const Breadcumbs = (props: BreadcumbsProps) => {
  const { title, items = [], children } = props;

  return (
    <div className="row wrapper border-bottom white-bg page-heading m-1 Breadcumbs-container">
      <div className="col-sm-4">
        <h2>{title}</h2>

        <ol className="breadcrumb">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={`${item.label}-${index}`}
                className={`breadcrumb-item ${isLast ? "active" : ""}`}
              >
                {isLast || !item.route ? (
                  <strong>{item.label}</strong>
                ) : (
                  <Button text={item.label} route={item.route} />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="col-sm-8">
        <div className="title-action">{children}</div>
      </div>
    </div>
  );
};
