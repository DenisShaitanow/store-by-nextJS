export type InputDropDownCalendarProps = {
  onChangeDate: (val: Date | null) => void;
  className?: string;
  id: string;
  title: string;
  value?: Date;
  placeholder: string;
  error?: string;
};
