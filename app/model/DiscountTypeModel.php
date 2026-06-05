<?php

class DiscountTypeModel
{
    private $discountTypeDal;

    public function __construct(DiscountTypeDal $discountTypeDal) {
        $this->discountTypeDal = $discountTypeDal;
    }

    public function getAllDiscountTypes() {
        return $this->discountTypeDal->getAll();
    }
}
