// app/order/FormOrderClient.tsx
"use client";

import { useEffect, useState, type ChangeEvent, type FC } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../services/hooks";
import { doOrder } from "../../../services/thunks/userUIData/userUIData-thunks";
import { selectBasket } from "../../../services/selectors/userUIData-selectors/userUIData-selectors";
import { InputUI } from "../../(components)/input";
import { InputDropDown } from "../../(components)/inputDropDown/imputDropDownSimple";
import { ButtonUI } from "../../(components)/button/button";
import { type IFormOrderData } from "../../../types";
import styles from "./FormOrder.module.css";

// Валидаторы и форматтеры (можно вынести в отдельный файл utils)
const formatCardNumber = (inputValue: string) => {
  let cleanValue = inputValue.replace(/\s/g, "").substring(0, 16);
  let formattedValue = "";
  for (let i = 0; i < cleanValue.length; i += 4) {
    if (i > 0) {
      formattedValue += " ";
    }
    formattedValue += cleanValue.substring(
      i,
      Math.min(cleanValue.length, i + 4)
    );
  }
  return formattedValue;
};

const validateNumberCard = (value: string) =>
  /^\d+$/.test(value.replace(/\s/g, ""));
const validatePersonCard = (value: string) => /^[A-Za-z\s]+$/.test(value);
const validateCVV = (value: string) => /^\d{3}$/.test(value);

const FormOrderClient: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const basket = useAppSelector(selectBasket);
  const basketListId = basket.map((product) => product.item.id);

  // Получаем данные из localStorage (только на клиенте)
  const getInitialFormData = (): IFormOrderData => {
    if (typeof window === "undefined") {
      return {
        selectСourier: true,
        adress: "",
        adressPoint: "",
        formPaySelf: true,
        numberCard: "",
        PersonCard: "",
        CVV: "",
        productList: [],
      };
    }

    const storedFormDataString = localStorage.getItem("orderForm");
    if (storedFormDataString) {
      try {
        return JSON.parse(storedFormDataString);
      } catch {
        // если ошибка парсинга - игнорируем
      }
    }

    return {
      selectСourier: true,
      adress: "",
      adressPoint: "",
      formPaySelf: true,
      numberCard: "",
      PersonCard: "",
      CVV: "",
      productList: [],
    };
  };

  const [formData, setFormData] = useState<IFormOrderData>(getInitialFormData);
  const [errors, setErrors] = useState({
    numberCardError: "",
    personCardError: "",
    cvvError: "",
  });
  const [buttonBuyDisabled, setButtonBuyDisabled] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  // Флаг монтирования для избежания гидратации
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Обновляем productList при изменении корзины
  useEffect(() => {
    if (isMounted) {
      setFormData((prev) => ({ ...prev, productList: basketListId }));
    }
  }, [basketListId, isMounted]);

  // Сохраняем в localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("orderForm", JSON.stringify(formData));
    }
  }, [formData, isMounted]);

  // Валидация при монтировании
  useEffect(() => {
    if (isMounted) {
      const numberCardValid = validateNumberCard(formData.numberCard);
      const personCardValid = validatePersonCard(formData.PersonCard);
      const cvvValid = validateCVV(formData.CVV);

      setErrors({
        numberCardError: numberCardValid ? "" : "Некорректный номер карты",
        personCardError: personCardValid
          ? ""
          : "Имя владельца должно содержать только латиницу",
        cvvError: cvvValid ? "" : "Код CVV должен содержать три цифры",
      });
    }
  }, [isMounted]);

  // Проверка валидности формы для кнопки
  useEffect(() => {
    if (!isMounted) return;

    const isValidAddressSelection =
      (formData.selectСourier && formData.adress.trim()) ||
      (!formData.selectСourier &&
        formData.adressPoint.trim() &&
        formData.productList);

    const isPaymentDataComplete =
      formData.formPaySelf ||
      (!formData.formPaySelf &&
        formData.numberCard.trim() !== "" &&
        formData.PersonCard.trim() !== "" &&
        formData.CVV.trim() !== "" &&
        !errors.cvvError &&
        !errors.numberCardError &&
        !errors.personCardError);

    setButtonBuyDisabled(!(isValidAddressSelection && isPaymentDataComplete));
  }, [formData, errors, isMounted]);

  const handleChangeNumberCard = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanedAndFormattedValue = formatCardNumber(rawValue);
    const valid = validateNumberCard(cleanedAndFormattedValue);
    setErrors((prev) => ({
      ...prev,
      numberCardError: valid ? "" : "Некорректный номер карты",
    }));
    setFormData((prev) => ({ ...prev, numberCard: cleanedAndFormattedValue }));
  };

  const handleChangePersonCard = (e: ChangeEvent<HTMLInputElement>) => {
    const valid = validatePersonCard(e.target.value as string);
    setErrors((prev) => ({
      ...prev,
      personCardError: valid
        ? ""
        : "Имя владельца должно содержать только латиницу",
    }));
    setFormData((prev) => ({ ...prev, PersonCard: e.target.value as string }));
  };

  const handleChangeCVV = (e: ChangeEvent<HTMLInputElement>) => {
    const CvvChecked = e.target.value.substring(0, 3);
    const valid = validateCVV(CvvChecked);
    setErrors((prev) => ({
      ...prev,
      cvvError: valid ? "" : "Код CVV должен содержать три цифры",
    }));
    setFormData((prev) => ({ ...prev, CVV: CvvChecked }));
  };

  const handleChangeAdress = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, adress: e.target.value }));
  };

  const handleChangePoint = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, adressPoint: e.target.value }));
  };

  const handleBuy = () => {
    dispatch(doOrder(formData));
    router.push("/orderComplited");
  };

  // Пока не смонтирован - показываем скелетон или null
  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <span className={styles.selectPay}>Выберете способ получения</span>
      <div className={styles.twoButtons}>
        <div
          className={`${styles.selectPayButton} ${!formData.selectСourier ? styles.select : ""}`}
          onClick={() => {
            setFormData((prev) => ({ ...prev, selectСourier: false }));
          }}
        >
          Самовывоз
        </div>
        <div
          className={`${styles.selectPayButton} ${formData.selectСourier ? styles.select : ""}`}
          onClick={() => {
            setFormData((prev) => ({ ...prev, selectСourier: true }));
          }}
        >
          Курьер
        </div>
      </div>
      {formData.selectСourier && (
        <InputUI
          dataCy="inputAdressDelivery"
          name="adress"
          type="text"
          title="Адрес"
          value={formData.adress}
          onChange={handleChangeAdress}
          placeholder="Введите адрес"
        />
      )}
      {!formData.selectСourier && (
        <InputDropDown
          className={styles.pointTake}
          id="1"
          title="Пункт выдачи"
          withInput={false}
          value={formData.adressPoint}
          onChangeOption={handleChangePoint}
          placeholder="Выберите удобный пункт выдачи"
          options={[
            { value: "ул.Мичурина, д.23", label: "ул.Мичурина, д.23" },
            { value: "пр-т Королева, д.26", label: "пр-т Королева, д.26" },
            { value: "пл. Ленина, д.17", label: "пл. Ленина, д.17" },
            { value: "ул. Кирова, д.17", label: "ул. Кирова, д.17" },
            { value: "ул. Сахарова, д.1", label: "ул. Сахарова, д.1" },
          ]}
        />
      )}

      <span className={styles.selectPay}>Выберете способ оплаты</span>
      <div className={styles.twoButtons}>
        <div
          className={`${styles.selectPayButton} ${formData.formPaySelf ? styles.select : ""}`}
          onClick={() => {
            setFormData((prev) => ({ ...prev, formPaySelf: true }));
          }}
        >
          Оплата при получении
        </div>
        <div
          className={`${styles.selectPayButton} ${!formData.formPaySelf ? styles.select : ""}`}
          onClick={() => {
            setFormData((prev) => ({ ...prev, formPaySelf: false }));
          }}
        >
          Оплата картой онлайн
        </div>
      </div>
      {!formData.formPaySelf && (
        <>
          <span className={styles.infoCard}>Введите данные карты</span>
          <div className={styles.cardInputs}>
            <InputUI
              error={!!errors.numberCardError}
              errorText={errors.numberCardError}
              name="numberCard"
              type="text"
              title="Номер карты"
              value={formData.numberCard}
              onChange={handleChangeNumberCard}
              placeholder="Введите номер карты"
            />
            <InputUI
              error={!!errors.cvvError}
              errorText={errors.cvvError}
              halfSize
              name="cvvCard"
              type="text"
              title="CVV"
              value={formData.CVV}
              onChange={handleChangeCVV}
              placeholder="Введите код с обратной стороны"
            />
            <InputUI
              error={!!errors.personCardError}
              errorText={errors.personCardError}
              name="personCard"
              type="text"
              title="Владелец карты"
              value={formData.PersonCard}
              onChange={handleChangePersonCard}
              placeholder="Введите имя владельца"
            />
          </div>
        </>
      )}

      <ButtonUI
        dataCy="makePurchase"
        className={styles.buttonBuy}
        label="Совершить покупку"
        disabled={buttonBuyDisabled}
        onClick={handleBuy}
      />
    </div>
  );
};

export default FormOrderClient;