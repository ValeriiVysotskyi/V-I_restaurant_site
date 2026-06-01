<?php

require_once __DIR__ . '/../dal/CategoryDal.php';


class CategoryModel
{
    private $categoryDal;

    public function __construct(CategoryDal $categoryDal) {
        $this->categoryDal = $categoryDal;
    }

    public function getAllCategories() {
        return $this->categoryDal->getAll();
    }
}



