type Category =
  | "t-shirts"
  | "shoes"
  | "trousers"
  | "jackets"
  | "hats"
  | "underwear"
  | "accessories";

export interface IProduct {
  id: string;
  price: number;
  title: string;
  description: string;
  image: string;
  shortDescription: string;
  category: Category;
  sex: "man" | "woman";
  isLiked: boolean;
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  surname: string;
  avatar: string;
  gender: string;
  location: string;
  birthdayDate: string;
}

export interface IFormOrderData {
  selectСourier: boolean;
  adress: string;
  adressPoint: string;
  formPaySelf: boolean;
  numberCard: string;
  PersonCard: string;
  CVV: string;
  productList: string[];
}
