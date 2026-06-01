<?php

require_once __DIR__ . '/../dal/RestaurantTableDal.php';


class RestaurantTableModel
{
    private $restaurantTableDal;

    public function __construct(RestaurantTableDal $restaurantTableDal) {
        $this->restaurantTableDal = $restaurantTableDal;
    }

    public function getTableByToken($token) {
        if (empty($token)) {
            throw new InvalidArgumentException('Table token is required.');
        }

        return $this->restaurantTableDal->getByToken($token);
    }
}

