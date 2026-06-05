
<?php

require_once "BaseDal.php";


class DiscountTypeDal extends BaseDal {
    protected $table = 'discount_type';
    protected $primaryKey = 'id';

    public function __construct($db) {
        parent::__construct($db);
    }
}