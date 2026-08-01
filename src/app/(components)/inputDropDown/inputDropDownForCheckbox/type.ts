export type InputDropDownForCheckboxProps = {
  options: { value: string; label: string }[];
  onChangeOption: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id: string;
  title: string;
  value?: string;
  placeholder: string;
  error?: string;
};
