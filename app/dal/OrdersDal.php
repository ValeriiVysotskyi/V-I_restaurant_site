<?php

require_once 'BaseDal.php';

class OrdersDal extends BaseDal
{
    protected $table = 'orders';
    protected $primaryKey = 'id';

    public function __construct($db) {
        parent::__construct($db);
    }

    public function getAdminOrderDetails($orderId) {
        $sql = "SELECT *
                FROM admin_order_details
                WHERE order_id = :order_id";

        $stmt = $this->query($sql, [
            'order_id' => $orderId
        ]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getWaiterOrderDetails($orderId) {
        $sql = "SELECT *
                FROM waiter_order_details
                WHERE order_id = :order_id";

        $stmt = $this->query($sql, [
            'order_id' => $orderId
        ]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}