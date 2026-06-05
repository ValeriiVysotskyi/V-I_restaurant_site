<?php

class DiscountTypeController {
    private $discountTypeModel;

    public function __construct() {
        $db = DbConnect::connect();
        $dal = new DiscountTypeDal($db);
        $this->discountTypeModel = new DiscountTypeModel($dal);
    }

    public function get() {
        header('Content-Type: application/json; charset=utf-8');

        $discountTypes = $this->discountTypeModel->getAllDiscountTypes();

        if (!$discountTypes) {
            $discountTypes = []; 
        }

        echo json_encode($discountTypes, JSON_UNESCAPED_UNICODE);
    }
}