<?php

require_once "BaseDal.php";


class OrderItemDal extends BaseDal {
    protected $table = 'order_item';
    protected $primaryKey = 'id';

    public function __construct($db) {
        parent::__construct($db);
    }

    public function getOrderDish($orderId, $dishId) {
        $sql = "SELECT *
                FROM order_item
                WHERE order_id = :order_id
                AND dish_id = :dish_id
                LIMIT 1";

        $stmt = $this->query($sql, ['order_id' => $orderId, 'dish_id' => $dishId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ?: null;
    }

    public function updateQuantity($orderId, $dishId, $quantity) {
        $sql = "UPDATE order_item
                SET quantity = :quantity
                WHERE order_id = :order_id
                AND dish_id = :dish_id";

        $stmt = $this->query($sql, ['quantity' => $quantity, 'order_id' => $orderId, 'dish_id' => $dishId]);

        return $stmt->rowCount() > 0;
    }

    public function deleteOrderDish($orderId, $dishId) {
        $sql = "DELETE FROM order_item
                WHERE order_id = :order_id
                AND dish_id = :dish_id";

        $stmt = $this->query($sql, ['order_id' => $orderId, 'dish_id' => $dishId]);

        return $stmt->rowCount() > 0;
    }
}