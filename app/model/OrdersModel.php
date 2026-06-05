<?php

require_once __DIR__ . '/../dal/OrdersDal.php';
require_once __DIR__ . '/../dal/OrderItemDal.php';


class OrdersModel
{
    private $ordersDal;
    private $orderItemDal;

    public function __construct(OrdersDal $ordersDal, OrderItemDal $orderItemDal) {
        $this->ordersDal = $ordersDal;
        $this->orderItemDal = $orderItemDal;
    }

    public function getWaiterOrderDetails($orderId) {
        return $this->ordersDal->getWaiterOrderDetails($orderId);
    }

    public function getActiveOrders() {
        return $this->ordersDal->getAll(['status_id' => 3], 'updated_at', 'DESC');
    }

    public function getOrderByTable($tableNumber) {
        $order = $this->ordersDal->findActiveOrderByTable($tableNumber);

        if ($order === null) {
            return 0;
        } else {
            return $order;
        }
    }

    public function addItemsToOrder($data) {
        $tableNumber = $data['table_number'];

        $order = $this->ordersDal->findActiveOrderByTable($tableNumber);

        if ($order === null) {
            $orderId = $this->ordersDal->insert([
                'status_id' => 3, 
                'table_number' => $tableNumber,
                'discount_type_id' => 3,
                'total_price' => 0,
                'price_without_discount' => 0,
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        
            if (!$orderId) {
                throw new Exception("Не вдалося створити нове замовлення в БД.");
            }
        } else {
            $orderId = $order['id'];
        }

        foreach ($data['items'] as $item) {
            $existingItem = $this->orderItemDal->getOrderDish($orderId, $item['id']);

            if ($existingItem) {
                $newQuantity = $existingItem['quantity'] + $item['quantity'];
                $this->orderItemDal->updateQuantity($orderId, $item['id'], $newQuantity);
            } else {
                $this->orderItemDal->insert([
                    'order_id' => $orderId,
                    'dish_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price_at_purchase' => $item['price']
                ]);
            }
        }

        return $orderId;
    }

 public function updateOrderItem($orderId, $dishId, $quantity) { 
        $order = $this->ordersDal->getById($orderId);

        if (!$order) {
            return "Error: Order $orderId not found in DB";
        }

        if ((int)$order['status_id'] !== 3) {
            return "Error: Order status is not 3";
        }

        if ($quantity <= 0) {
            return $this->orderItemDal->deleteOrderDish($orderId, $dishId);
        }

        $result = $this->orderItemDal->updateQuantity($orderId, $dishId, $quantity);
        
        if (!$result) {
            return "Error: SQL update failed in OrderItemDal";
        }
        
        return true;
    }

    public function updateOrder($order)
    {
        if (!isset($order['id'])) {
            return false;
        }

        $orderId = $order['id'];
        unset($order['id']);

        return $this->ordersDal->update($orderId, $order);
    }

    public function getAdminOrders($statusId = null, $tableNumber = null, $dateFrom = null, $dateTo = null) {
        return $this->ordersDal->getAdminOrders($statusId,$tableNumber, $dateFrom, $dateTo);
    }

    public function getAdminOrderDetails($orderId)
    {
        return $this->ordersDal->getAdminOrderDetails($orderId);
    }
}