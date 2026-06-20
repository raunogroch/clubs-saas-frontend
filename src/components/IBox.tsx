import { useState, type ReactNode } from "react";

interface IBoxProps {
  title: ReactNode;
  children: ReactNode;
  initialCollapsed?: boolean;
}

export const IBox = (props: IBoxProps) => {
  const [collapsed, setCollapsed] = useState(props.initialCollapsed ?? false);
  return (
    <div className={`ibox ${collapsed ? "collapsed" : ""}`}>
      <div className="ibox-title" onClick={() => setCollapsed(!collapsed)}>
        <h5>{props.title}</h5>
        <div className="ibox-tools">
          <a className="collapse-link">
            <i className="fa fa-chevron-up"></i>
          </a>
        </div>
      </div>
      <div className="ibox-content">{props.children}</div>
    </div>
  );
};
