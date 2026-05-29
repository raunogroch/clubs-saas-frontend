interface FooterProps {
  companyName: string;
  range: string;
}

export const Footer = (props: FooterProps) => {
  return (
    <div className="footer">
      <div className="text-center">
        <strong>Copyright</strong> {props.companyName} &copy; {props.range}
      </div>
    </div>
  );
};
