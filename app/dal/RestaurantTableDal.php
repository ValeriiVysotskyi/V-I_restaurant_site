<?php

require_once "BaseDal.php";


class RestaurantTableDal extends BaseDal {
    protected $table = 'restaurant_table';
    protected $primaryKey = 'number';

    public function __construct($db) {
        parent::__construct($db);
    }
}