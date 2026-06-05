<?php

class RestaurantTableController {
    private $restaurantTableModel;

    public function __construct() {
        $db = DbConnect::connect();
        $dal = new RestaurantTableDal($db);
        $this->restaurantTableModel = new RestaurantTableModel($dal);
    }

    public function get(){
        header('Content-Type: application/json; charset=utf-8');
        $token = $_GET['token'] ?? null;

        if ($token === null) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Parameter token is required'
            ]);
            return;
        }

        $result = $this->restaurantTableModel->getTableByToken($token);
        echo json_encode($result);
    }
}