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

        $stmt = $this->query($sql, ['order_id' => $orderId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getWaiterOrderDetails($orderId) {
        $sql = "SELECT *
                FROM waiter_order_details
                WHERE order_id = :order_id";

        $stmt = $this->query($sql, ['order_id' => $orderId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findActiveOrderByTable($tableNumber) {
        $sql = "SELECT *
                FROM orders
                WHERE table_number = :table_number
                AND status_id = 3
                LIMIT 1";

        $stmt = $this->query($sql, ['table_number' => $tableNumber]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ?: null;
    }

    public function getAdminOrders($statusId = null, $tableNumber = null, $dateFrom = null, $dateTo = null) {
        $sql = "SELECT *
                FROM admin_order_details
                WHERE 1 = 1";

        $params = [];

        if ($statusId !== null) {
            $sql .= " AND status_id = :status_id";
            $params['status_id'] = $statusId;
        }

        if ($tableNumber !== null) {
            $sql .= " AND table_number = :table_number";
            $params['table_number'] = $tableNumber;
        }

        if ($dateFrom !== null) {
            $sql .= " AND updated_at >= :date_from";
            $params['date_from'] = $dateFrom;
        }

        if ($dateTo !== null) {
            $sql .= " AND updated_at <= :date_to";
            $params['date_to'] = $dateTo;
        }

        return $this->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
    }
}