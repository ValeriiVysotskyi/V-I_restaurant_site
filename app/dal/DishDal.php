<?php

require_once "BaseDal.php";


class DishDal extends BaseDal {
    protected $table = 'dish';
    protected $primaryKey = 'id';

    public function __construct($db) {
        parent::__construct($db);
    }
}
