interface DropdownMenuProps {
  options: OptionProps[];
}

interface OptionProps {
  divider?: boolean;
  label: string;
  route?: string;
  onClick?: () => void;
}

export const DropdownMenu = ({ options }: DropdownMenuProps) => {
  return (
    <ul className="dropdown-menu animated fadeInRight p-2">
      {options.map((option, index) => (
        <div key={index}>
          {option.divider && <li className="dropdown-divider"></li>}
          <li>
            <a
              style={{ color: "grey" }}
              className="dropdown-item"
              href={option.route || "#"}
              onClick={(e) => {
                if (option.onClick) {
                  e.preventDefault();
                  option.onClick();
                }
              }}
            >
              {option.label}
            </a>
          </li>
        </div>
      ))}
    </ul>
  );
};
