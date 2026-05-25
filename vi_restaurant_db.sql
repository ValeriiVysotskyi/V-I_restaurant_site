-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.4:3306
-- Время создания: Май 25 2026 г., 16:41
-- Версия сервера: 8.4.8
-- Версия PHP: 8.5.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `vi_restaurant`
--

-- --------------------------------------------------------

--
-- Структура таблицы `category`
--

CREATE TABLE `category` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Гарячі страви'),
(2, 'Салати'),
(3, 'Закуски'),
(4, 'Десерти'),
(5, 'Бар');

-- --------------------------------------------------------

--
-- Структура таблицы `discount_type`
--

CREATE TABLE `discount_type` (
  `id` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `rate` decimal(3,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `discount_type`
--

INSERT INTO `discount_type` (`id`, `name`, `rate`) VALUES
(1, 'Знижка співробітника', 0.15),
(2, 'Знижка день народження', 0.20),
(3, 'Без знижки', 0.00);

-- --------------------------------------------------------

--
-- Структура таблицы `dish`
--

CREATE TABLE `dish` (
  `id` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `category_id` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `weight` int NOT NULL,
  `is_available` tinyint(1) NOT NULL,
  `image_path` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `dish`
--

INSERT INTO `dish` (`id`, `name`, `category_id`, `price`, `description`, `weight`, `is_available`, `image_path`) VALUES
(1, 'Борщ український', 1, 150.00, 'Традиційний борщ зі свининою, подається зі сметаною та пампушками', 350, 1, './assets/images/dishes/borsch.jpg'),
(2, 'Стейк Рибай', 1, 650.00, 'Соковитий стейк з мармурової яловичини', 250, 1, './assets/images/dishes/ribeye.jpg'),
(3, 'Паста Карбонара', 1, 240.00, 'Класична італійська паста з беконом, пармезаном та яєчним жовтком', 300, 1, './assets/images/dishes/carbonara.jpg'),
(4, 'Котлета по-київськи', 1, 210.00, 'Ніжне куряче філе з вершковим маслом та зеленню всередині', 250, 1, './assets/images/dishes/kyiv_cutlet.jpg'),
(5, 'Деруни з грибним соусом', 1, 180.00, 'Хрусткі картопляні млинці з лісовими грибами у вершках', 300, 1, './assets/images/dishes/deruny.jpg'),
(6, 'Цезар з куркою', 2, 260.00, 'Мікс салатів, куряче філе гриль, бекон, пармезан, крутони, соус', 280, 1, './assets/images/dishes/caesar.jpg'),
(7, 'Грецький салат', 2, 210.00, 'Свіжі овочі, сир фета, оливки, оливкова олія', 250, 1, './assets/images/dishes/greek.jpg'),
(8, 'Теплий салат з телятиною', 2, 320.00, 'Ніжна телятина, мікс салатів, чері, бальзамічний соус', 270, 1, './assets/images/dishes/veal_salad.jpg'),
(9, 'Салат з тунцем', 2, 290.00, 'Консервований тунець, яйце, мікс салатів, стручкова квасоля', 260, 1, './assets/images/dishes/tuna_salad.jpg'),
(10, 'Капрезе', 2, 240.00, 'Томати, сир моцарела, соус песто', 220, 1, './assets/images/dishes/caprese.jpg'),
(11, 'Олів\'є з лососем', 2, 280.00, 'Авторський варіант класичного салату з слабосолоним лососем', 250, 1, './assets/images/dishes/olivie_salmon.jpg'),
(12, 'Салат з прошуто і грушею', 2, 310.00, 'Прошуто, карамелізована груша, сир дорблю, мікс салатів', 240, 1, './assets/images/dishes/prosciutto_pear.jpg'),
(13, 'Сирне плато', 3, 450.00, 'Асорті елітних сирів з медом та горіхами', 300, 1, './assets/images/dishes/cheese_plate.jpg'),
(14, 'М\'ясна нарізка', 3, 420.00, 'Асорті крафтових ковбас та в\'яленого м\'яса', 300, 1, './assets/images/dishes/meat_plate.jpg'),
(15, 'Тартар з телятини', 3, 350.00, 'Дрібно рублена сира телятина з каперсами та перепелиним жовтком', 200, 1, './assets/images/dishes/tartare.jpg'),
(16, 'Брускети з лососем', 3, 260.00, 'Хрусткий чіабата з крем-сиром та слабосолоним лососем', 220, 1, './assets/images/dishes/bruschetta.jpg'),
(17, 'Карпаччо з яловичини', 3, 340.00, 'Тонкі скибочки сирої яловичини з пармезаном та руколою', 180, 1, './assets/images/dishes/carpaccio.jpg'),
(18, 'Чизкейк Нью-Йорк', 4, 180.00, 'Класичний сирний десерт на пісочній основі', 150, 1, './assets/images/dishes/cheesecake.jpg'),
(19, 'Тірамісу', 4, 190.00, 'Ніжний італійський десерт з маскарпоне та кавою', 160, 1, './assets/images/dishes/tiramisu.jpg'),
(20, 'Шоколадний фондан', 4, 210.00, 'Кекс з рідким шоколадним центром, подається з морозивом', 180, 1, './assets/images/dishes/fondant.jpg'),
(21, 'Торт Наполеон', 4, 160.00, 'Листковий торт із заварним кремом', 170, 1, './assets/images/dishes/napoleon.jpg'),
(22, 'Морозиво власного виробництва', 4, 110.00, 'Кульки морозива на вибір (ваніль, шоколад, фісташка)', 150, 1, './assets/images/dishes/ice_cream.jpg'),
(23, 'Еспресо', 5, 55.00, 'Класична міцна кава', 30, 1, './assets/images/dishes/espresso.jpg'),
(24, 'Капучино', 5, 80.00, 'Кава з додаванням збитого молока', 200, 1, './assets/images/dishes/cappuccino.jpg'),
(25, 'Чай чорний', 5, 75.00, 'Заварний чорний чай з бергамотом', 400, 1, './assets/images/dishes/black_tea.jpg'),
(26, 'Чай зелений', 5, 75.00, 'Заварний зелений чай з жасмином', 400, 1, './assets/images/dishes/green_tea.jpg'),
(27, 'Пиво світле розливне', 5, 110.00, 'Крафтове світле пиво', 500, 1, './assets/images/dishes/light_beer.jpg'),
(28, 'Пиво темне розливне', 5, 120.00, 'Крафтове темне пиво (стаут)', 500, 1, './assets/images/dishes/dark_beer.jpg'),
(29, 'Коктейль Апероль Шприц', 5, 240.00, 'Освіжаючий коктейль на основі Аперолю та Просекко', 250, 1, './assets/images/dishes/aperol.jpg'),
(30, 'Коктейль Мохіто', 5, 220.00, 'Ром, м\'ята, лайм, содова', 300, 1, './assets/images/dishes/mojito.jpg'),
(31, 'Коктейль Негроні', 5, 260.00, 'Джин, вермут, біттер', 150, 1, './assets/images/dishes/negroni.jpg'),
(32, 'Лимонад цитрусовий', 5, 130.00, 'Освіжаючий лимонад власного приготування', 400, 1, './assets/images/dishes/lemonade.jpg'),
(33, 'Сік апельсиновий фреш', 5, 140.00, 'Свіжовичавлений апельсиновий сік', 250, 1, './assets/images/dishes/orange_fresh.jpg');

-- --------------------------------------------------------

--
-- Структура таблицы `dish_product`
--

CREATE TABLE `dish_product` (
  `dish_id` int NOT NULL,
  `product_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` bigint NOT NULL,
  `status_id` int NOT NULL,
  `table_number` int NOT NULL,
  `discount_type_id` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `price_without_discount` decimal(10,2) NOT NULL,
  `payment_method` varchar(15) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `order_item`
--

CREATE TABLE `order_item` (
  `order_id` bigint NOT NULL,
  `dish_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `order_status`
--

CREATE TABLE `order_status` (
  `id` int NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `order_status`
--

INSERT INTO `order_status` (`id`, `name`) VALUES
(1, 'Скасований'),
(2, 'Сплачений'),
(3, 'В роботі');

-- --------------------------------------------------------

--
-- Структура таблицы `product`
--

CREATE TABLE `product` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `amount_in_stock` int NOT NULL,
  `supplier_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `restaurant_table`
--

CREATE TABLE `restaurant_table` (
  `number` int NOT NULL,
  `token` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `restaurant_table`
--

INSERT INTO `restaurant_table` (`number`, `token`) VALUES
(1, 'c29b6f12-8e7d-4b95-a13a-7d4e5f2c8b91'),
(2, 'a18f9d33-4c5e-4a67-b892-1e3d4c5b6a78'),
(3, 'f47c8b21-9a1b-4d3e-c254-8e7f9a1b2c3d'),
(4, 'd36e7a10-8b0c-4f2d-b143-7d8e9f0a1b2c'),
(5, 'e25d690f-7a9b-4e1c-a032-6c7d8e9f0a1b'),
(6, 'b14c58f9-698a-4d0b-9f21-5b6c7d8e9f0a'),
(7, '9f3b47e8-5879-4cfa-8e10-4a5b6c7d8e9f'),
(8, '8e2a36d7-4768-4beb-7d0f-394a5b6c7d8e'),
(9, '7d1925c6-3657-4ada-6cfa-28394a5b6c7d'),
(10, '6c0814b5-2546-49c9-5be9-1728394a5b6c'),
(11, '5b9703a4-1435-48b8-4ad8-061728394a5b'),
(12, '4a86f293-0324-47a7-39c7-f5061728394a'),
(13, '3975e182-f213-4696-28b6-e4f506172839'),
(14, '2864d071-e102-4585-17a5-d3e4f5061728'),
(15, '1753cf60-d0f1-4474-0694-c2d3e4f50617');

-- --------------------------------------------------------

--
-- Структура таблицы `supplier`
--

CREATE TABLE `supplier` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  `city` varchar(30) NOT NULL,
  `phone` varchar(17) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `username` varchar(15) NOT NULL,
  `salt` varchar(50) NOT NULL,
  `hashed_password` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`username`, `salt`, `hashed_password`) VALUES
('administrator', '35a2cd9b-29e0-40a6-ad45-0bc998b2e80a', '98074ffb8d566467d98823229719475cfc57efe0c2facdc2a2e42e9af84b6ba1'),
('waiter', '75165155-0163-415b-8d44-019949eb526f', '6b0cb0bfba2a09ef690db358298c1e422134a62b37a8aa8cc81b08f66da99966');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `discount_type`
--
ALTER TABLE `discount_type`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `dish`
--
ALTER TABLE `dish`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Индексы таблицы `dish_product`
--
ALTER TABLE `dish_product`
  ADD PRIMARY KEY (`dish_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `table_number` (`table_number`),
  ADD KEY `discount_type_id` (`discount_type_id`);

--
-- Индексы таблицы `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`order_id`,`dish_id`),
  ADD KEY `dish_id` (`dish_id`);

--
-- Индексы таблицы `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Индексы таблицы `restaurant_table`
--
ALTER TABLE `restaurant_table`
  ADD PRIMARY KEY (`number`);

--
-- Индексы таблицы `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `category`
--
ALTER TABLE `category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `discount_type`
--
ALTER TABLE `discount_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `dish`
--
ALTER TABLE `dish`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `order_status`
--
ALTER TABLE `order_status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `product`
--
ALTER TABLE `product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `restaurant_table`
--
ALTER TABLE `restaurant_table`
  MODIFY `number` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `dish`
--
ALTER TABLE `dish`
  ADD CONSTRAINT `dish_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

--
-- Ограничения внешнего ключа таблицы `dish_product`
--
ALTER TABLE `dish_product`
  ADD CONSTRAINT `dish_product_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`),
  ADD CONSTRAINT `dish_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `order_status` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`table_number`) REFERENCES `restaurant_table` (`number`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`discount_type_id`) REFERENCES `discount_type` (`id`);

--
-- Ограничения внешнего ключа таблицы `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`);

--
-- Ограничения внешнего ключа таблицы `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
