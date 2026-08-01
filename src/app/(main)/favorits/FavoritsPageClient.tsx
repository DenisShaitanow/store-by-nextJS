// app/(shop)/favorites/FavoritesPageClient.tsx
"use client";

import {
  useState,
  useEffect,
  type ChangeEvent,
  useMemo,
  useRef,
  useCallback,
} from "react";
import Link from "next/link";
import styles from "./FavoritsPage.module.css";
import { useAppDispatch, useAppSelector } from "../../../services/hooks";
import { getProducts } from "../../../services/thunks/userUIData/userUIData-thunks";
import {
  selectLoadingProducts,
  selectFavorirsProducts,
} from "../../../services/selectors/userUIData-selectors/userUIData-selectors";
import { ProductCard } from "../../(components)/productCard";
import type { IProduct } from "../../(components)/productCard/type";
import { CheckboxGroupUI } from "../../(components)/checkbox";
import { CheckboxDropdown } from "../../(components)/checkboxDropdown";
import { SpinnerPulse } from "../../(components)/spinnerPulse";

const categoryMapping: string[] = [
  "t-shirts",
  "shoes",
  "jackets",
  "underwear",
  "hats",
  "trousers",
  "accessories",
];

const sexMapping: Record<string, string> = {
  "Для мужчин": "man",
  "Для женщин": "woman",
};

export default function FavoritesPageClient() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectLoadingProducts);
  const [isMounted, setIsMounted] = useState(false);

  const productsContainer = useRef<HTMLDivElement>(null);
  const productCard = useRef<HTMLDivElement>(null);
  const productsContainerWidth = productsContainer.current?.clientWidth;
  const [productsToShow, setProductsToShow] = useState<IProduct[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedSex, setSelectedSex] = useState<string[]>([]);
  const [selectedSexData, setSelectedSexData] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    (string | number)[]
  >([]);
  const [selectedCategoriesData, setSelectedCategoriesData] = useState<
    string[]
  >([]);

  const calculateVisibleProductsCount = (width: number) => {
    const cardsPerRow = Math.floor(
      width / (productCard.current?.clientWidth || 240)
    );
    return cardsPerRow * 4;
  };

  useEffect(() => {
    setIsMounted(true);
    dispatch(getProducts());
  }, [dispatch]);

  const products: IProduct[] = useAppSelector(selectFavorirsProducts);
  const noProducts: boolean = products.length > 0;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        selectedCategoriesData.length > 0 &&
        !selectedCategoriesData.includes(product.category)
      ) {
        return false;
      }
      if (
        selectedSexData.length > 0 &&
        !selectedSexData.includes(product.sex)
      ) {
        return false;
      }
      return true;
    });
  }, [selectedCategoriesData, selectedSexData, products]);

  useEffect(() => {
    if (isMounted && productsContainer.current) {
      const containerWidth = productsContainer.current.clientWidth;
      const visibleCardsCount = calculateVisibleProductsCount(containerWidth);
      setProductsToShow(filteredProducts.slice(0, visibleCardsCount));
    }
  }, [filteredProducts, productsContainer, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    function handleResize() {
      if (productsContainer.current) {
        const currentWidth = productsContainer.current.clientWidth;
        const newVisibleCount = calculateVisibleProductsCount(currentWidth);
        setProductsToShow(filteredProducts.slice(0, newVisibleCount));
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [filteredProducts, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    function handleScroll() {
      const bottomReached =
        document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.offsetHeight - 20;

      if (
        bottomReached &&
        !isLoadingMore &&
        productsToShow.length < products.length
      ) {
        setIsLoadingMore(true);

        const nextBatchSize = calculateVisibleProductsCount(
          productsContainerWidth!
        );
        const startIndex = productsToShow.length;
        const endIndex = Math.min(startIndex + nextBatchSize, products.length);
        setTimeout(() => {
          setProductsToShow((prev) => [
            ...prev,
            ...filteredProducts.slice(startIndex, endIndex),
          ]);
          setIsLoadingMore(false);
        }, 1000);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [products, isLoadingMore, productsToShow, filteredProducts, isMounted]);

  const handleSex = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedItem: string = e.target.id;
      const selectedItemData: string = sexMapping[selectedItem];
      if (selectedSex.includes(selectedItem)) {
        setSelectedSex((prevSelectedItems) =>
          prevSelectedItems.filter((item) => item !== selectedItem)
        );
        setSelectedSexData((prevSelectedSexData) =>
          prevSelectedSexData.filter((item) => item !== selectedItemData)
        );
      } else {
        setSelectedSex((prevSelectedItems) => [
          ...prevSelectedItems,
          selectedItem,
        ]);
        setSelectedSexData((prevSelectedSexData) => [
          ...prevSelectedSexData,
          selectedItemData,
        ]);
      }
    },
    [selectedSex]
  );

  const handleCategories = useCallback(
    (selectedValues: (string | number)[]) => {
      setSelectedCategories(selectedValues);
      setSelectedCategoriesData(
        selectedValues.map((item) => categoryMapping[item as number])
      );
    },
    []
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.rowContainer}>
      <div className={styles.containerFixed}>
        <div className={styles.filters}>
          <div>
            <CheckboxGroupUI
              title="Пол"
              selectedItems={selectedSex}
              fieldNames={["Для женщин", "Для мужчин"]}
              onChange={handleSex}
            />
          </div>
          <div>
            <CheckboxDropdown
              selectedValues={selectedCategories}
              onChange={handleCategories}
              title="Категория"
              staticMode
              options={[
                "Рубашки",
                "Обувь",
                "Верхняя одежда",
                "Нижнее белье",
                "Головные уборы",
                "Брюки",
                "Аксессуары",
              ]}
            />
          </div>
        </div>
      </div>
      <span className={styles.greyLine}></span>
      {noProducts ? (
        <div className={styles.products} ref={productsContainer}>
          {isLoading && <SpinnerPulse className={styles.spinner} />}
          {!isLoading &&
            productsToShow.map((product) => (
              <Link
                href={`/card/id=${product.id}`}
                key={product.id}
                className={styles.productLink}
              >
                <ProductCard
                  ref={productCard}
                  className={styles.product}
                  title={product.title}
                  description={product.description}
                  shortDescription={product.shortDescription}
                  price={product.price}
                  id={product.id}
                  image={product.image}
                  category={product.category}
                  sex={product.sex}
                  isLiked={product.isLiked}
                />
              </Link>
            ))}
        </div>
      ) : (
        <div className={styles.noProductsContainer}>
          <span className={styles.noProducts}>
            Вы пока еще не выбрали понравившиеся товары. Но вы можете сделать
            это прямо сейчас!
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.noProductsSVG}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M6.09 14.999c-.38934-.88-.59031-1.8317-.59-2.794 0-3.70501 2.91-6.70601 6.5-6.70601s6.5 3.002 6.5 6.70601c.0003.9623-.2007 1.914-.59 2.794M12 1.99899v1M22 11.999h-1m-18 0H2m17.07-7.07101-.707.707m-12.726.001-.707-.707M14.517 19.306c1.01-.327 1.416-1.252 1.53-2.182.034-.278-.195-.509-.475-.509H8.477c-.06838-.0011-.1362.0123-.199.0394-.06279.0271-.11912.0672-.16525.1177-.04613.0505-.08102.1102-.10235.1752-.02134.0649-.02863.1337-.0214.2017.112.928.394 1.606 1.464 2.156m5.064.001-5.064-.001m5.064.001c-.121 1.945-.683 2.715-2.51 2.693-1.954.036-2.404-.917-2.554-2.694"
            />
          </svg>
        </div>
      )}
      {isLoadingMore && (
        <div className={styles.spinnerContainer}>
          <SpinnerPulse className={styles.spinnerLoadCards} />
        </div>
      )}
    </div>
  );
}