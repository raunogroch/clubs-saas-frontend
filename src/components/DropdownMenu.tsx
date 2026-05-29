interface DropdownMenuProps {
  options: OptionProps[];
}

interface OptionProps {
  divider?: boolean;
  label: string;
  route: string;
}

export const DropdownMenu = ({ options }: DropdownMenuProps) => {
  return (
    <ul className="dropdown-menu animated fadeInRight m-t-xs">
      {options.map((option) => (
        <>
          {option.divider && <li className="dropdown-divider"></li>}
          <li key={option.route}>
            <a className="dropdown-item" href={option.route}>
              {option.label}
            </a>
          </li>
        </>
      ))}
    </ul>
  );
};
