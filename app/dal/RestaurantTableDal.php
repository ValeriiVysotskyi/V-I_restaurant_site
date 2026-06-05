<?php


class RestaurantTableDal extends BaseDal {
    protected $table = 'restaurant_table';
    protected $primaryKey = 'number';

    public function __construct($db) {
        parent::__construct($db);
    }

    public function getByToken($token) {
        $sql = "
            SELECT *
            FROM restaurant_table
            WHERE token = :token
        ";

        return $this->query($sql, [':token' => $token])->fetch();
    }
}