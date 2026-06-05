<?php

require_once "BaseDal.php";


class DishDal extends BaseDal {
    protected $table = 'dish';
    protected $primaryKey = 'id';

    public function __construct($db) {
        parent::__construct($db);
    }

    public function getByCategoryId($categoryId) {
        $sql = "SELECT *
                FROM {$this->table}
                WHERE category_id = :category_id";

        return $this->query($sql, ['category_id' => $categoryId])->fetchAll(PDO::FETCH_ASSOC);
    }
}
