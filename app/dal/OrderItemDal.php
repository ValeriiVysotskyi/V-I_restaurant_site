<?php

require_once "BaseDal.php";


class OrderItemDal extends BaseDal {
    protected $table = 'order_item';
    protected $primaryKey = 'id';

    public function __construct($db) {
        parent::__construct($db);
    }
}