<?php

require_once "BaseDal.php";


class RestaurantTableDal extends BaseDal {
    protected $table = 'restaurant_table';
    protected $primaryKey = 'number';

    public function __construct($db) {
        parent::__construct($db);
    }

    public function getByToken(string $token) {
        $sql = "
            SELECT *
            FROM restaurant_table
            WHERE token = :token
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute([':token' => $token]);

        return $stmt->fetch();
    }
}