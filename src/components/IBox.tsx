import { useState } from "react";

interface IBoxProps {
  title: string;
  children: React.ReactNode;
}

export const IBox = (props: IBoxProps) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`ibox ${collapsed ? "collapsed" : ""}`}>
      <div className="ibox-title">
        <h5>{props.title}</h5>
        <div className="ibox-tools">
          <a className="collapse-link" onClick={() => setCollapsed(!collapsed)}>
            <i className="fa fa-chevron-up"></i>
          </a>
        </div>
      </div>
      <div className="ibox-content">{props.children}</div>
    </div>
  );
};
