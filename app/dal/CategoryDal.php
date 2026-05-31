<?php

require_once "BaseDal.php";


class CategoryDal extends BaseDal {
    protected $table = 'category';
    protected $primaryKey = 'id';

    public function __construct($db) {
        parent::__construct($db);
    }
}