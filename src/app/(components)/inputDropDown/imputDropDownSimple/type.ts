export type InputDropDownProps = {
  options: { value: string; label: string }[];
  withInput: boolean;
  onChangeOption: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  classNameImageOpen?: string;
  id: string;
  title: string;
  value?: string;
  placeholder: string;
  error?: string;
  dataCy?: string;
};
