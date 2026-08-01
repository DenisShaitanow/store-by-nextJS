export type FormUserInformationStepTwoProps = {
  hiddenAvatarInput: boolean;
  changeAvatarUrl: (val: File) => void;
  nameValue: string;
  nameChange: (val: string) => void;
  surnameValue: string;
  surnameChange: (val: string) => void;
  birthdayDateChange: (val: string) => void;
  genderOptions: {
    value: string;
    label: string;
  }[];
  genderValue: string;
  genderChange: (val: string) => void;
  locatonValue: string;
  locationChange: (val: string) => void;
  birthdayDateValue?: Date;
};
