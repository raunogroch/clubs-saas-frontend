interface IBoxProps {
  title: string;
  children: React.ReactNode;
}

export const IBox = (props: IBoxProps) => {
  return (
    <div className="ibox">
      <div className="ibox-title">
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
