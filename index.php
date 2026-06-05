<?php
ob_start();
date_default_timezone_set('Europe/Kyiv');

require_once __DIR__ . '/vendor/autoload.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$router = new Router();

$router->add('/api/category', 'CategoryController');
$router->add('/api/restaurant_table', 'RestaurantTableController');
$router->add('/api/discount_type', 'DiscountTypeController');
$router->add('/api/dish', 'DishController');
$router->add('/api/dish/{id}', 'DishController');
$router->add('/api/dish/upload', 'DishController');
$router->add('/api/orders', 'OrdersController');
$router->add('/api/orders/{id}', 'OrdersController');

$router->dispatch($uri);