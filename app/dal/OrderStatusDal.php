<?php

require_once "BaseDal.php";


class OrderStatusDal extends BaseDal {
    protected $table = 'order_status';
    protected $primaryKey = 'id';

    public function __construct($db) {
        parent::__construct($db);
    }
}