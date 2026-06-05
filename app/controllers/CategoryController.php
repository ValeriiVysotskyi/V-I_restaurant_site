<?php 

class CategoryController {
    private $categoryModel;

    public function __construct() {
        $db = DbConnect::connect();
        $dal = new CategoryDal($db);
        $this->categoryModel = new CategoryModel($dal);
    }
    public function get() {
        header('Content-Type: application/json; charset=utf-8');

        $categories = $this->categoryModel->getAllCategories();

        if (!$categories) {
            $categories = []; 
        }

        echo json_encode($categories);
    }
}