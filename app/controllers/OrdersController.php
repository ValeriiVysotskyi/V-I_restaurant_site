<?php

class OrdersController {
    private $ordersModel;

    public function __construct() {
        $db = DbConnect::connect();
        $ordersDal = new OrdersDal($db);
        $orderItemDal = new OrderItemDal($db);
        $this->ordersModel = new OrdersModel($ordersDal, $orderItemDal);
    }

    private function jsonResponse($data, $statusCode = 200) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public function get($id = null) {
        if (isset($_GET['admin'])) {
            $statusId = isset($_GET['status_id']) ? $_GET['status_id'] : null;
            $tableNumber = isset($_GET['table_number']) ? $_GET['table_number'] : null;
            $dateFrom = isset($_GET['date_from']) ? $_GET['date_from'] : null;
            $dateTo = isset($_GET['date_to']) ? $_GET['date_to'] : null;

            $flatOrders = $this->ordersModel->getAdminOrders(
                $statusId,
                $tableNumber,
                $dateFrom,
                $dateTo
            );

            if (!$flatOrders) {
                return $this->jsonResponse([]);
            }

            $groupedOrders = [];

            foreach ($flatOrders as $row) {

                $orderId = $row['order_id'];

                if (!isset($groupedOrders[$orderId])) {
                    $groupedOrders[$orderId] = [
                        'order_id' => $row['order_id'],
                        'status_id' => $row['status_id'],
                        'table_number' => $row['table_number'],
                        'discount_type_id' => $row['discount_type_id'],
                        'total_price' => $row['total_price'],
                        'price_without_discount' => $row['price_without_discount'],
                        'payment_method' => $row['payment_method'],
                        'updated_at' => $row['updated_at'],
                        'status_name' => $row['status_name'],
                        'discount_name' => $row['discount_name'],
                        'discount_rate' => $row['discount_rate'],
                        'dishes' => []
                    ];
                }

                if (!empty($row['dish_id'])) {
                    $groupedOrders[$orderId]['dishes'][] = [
                        'dish_id' => $row['dish_id'],
                        'quantity' => $row['quantity'],
                        'price_at_purchase' => $row['price_at_purchase'],
                        'dish_name' => $row['dish_name'],
                        'image_path' => $row['image_path']
                    ];
                }
            }

            return $this->jsonResponse(array_values($groupedOrders));
        }

        if (isset($_GET['order_id'])) {
            $flatDetails = $this->ordersModel->getWaiterOrderDetails($_GET['order_id']);
            
            if (!$flatDetails) {
                return $this->jsonResponse([]);
            }

            $groupedOrder = [
                'order_id' => $flatDetails[0]['order_id'],
                'table_number' => $flatDetails[0]['table_number'],
                'price_without_discount' => $flatDetails[0]['price_without_discount'],
                'updated_at' => $flatDetails[0]['updated_at'],
                'dishes' => []
            ];

            foreach ($flatDetails as $row) {
                $groupedOrder['dishes'][] = [
                    'dish_id'           => $row['dish_id'],
                    'dish_name'         => $row['dish_name'],
                    'image_path'        => $row['image_path'],
                    'price_at_purchase' => $row['price_at_purchase'],
                    'quantity'          => $row['quantity']
                ];
            }

            return $this->jsonResponse($groupedOrder);
        }

        if (isset($_GET['table_number']) && !isset($_GET['admin'])) {
            $order = $this->ordersModel->getOrderByTable($_GET['table_number']);
            return $this->jsonResponse($order);
        }
        
        if (isset($_GET['status_id'])) {
            $orders = $this->ordersModel->getActiveOrders();
            return $this->jsonResponse($orders ?: []); 
        }
        $this->jsonResponse(['error' => 'Missing query parameters (table_number, admin, or id)'], 400);
    }

    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['table_number']) || !isset($input['items'])) {
            $this->jsonResponse(['error' => 'table_number and items array are required'], 400);
        }

        $orderId = $this->ordersModel->addItemsToOrder($input);
        
        $this->jsonResponse(['success' => true, 'order_id' => $orderId], 201);
    }

    public function update($id = null) {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            $this->jsonResponse(['error' => 'Invalid JSON data'], 400);
        }

        if ($id && isset($input['dish_id']) && isset($input['quantity'])) {
            $success = $this->ordersModel->updateOrderItem($id, $input['dish_id'], $input['quantity']);
            return $this->jsonResponse(['success' => $success]);
        }

        $success = $this->ordersModel->updateOrder($input);
        
        if ($success) {
            $this->jsonResponse(['success' => true]);
        } else {
            $this->jsonResponse(['error' => 'Failed to update order'], 400);
        }
    }

    public function delete() {
        $input = json_decode(file_get_contents('php://input'), true);
        $orderId = isset($input['order_id']) ? $input['order_id'] : null;
        $dishId = isset($input['dish_id']) ? $input['dish_id'] : null;

        if (!$orderId) { $orderId = isset($_GET['order_id']) ? $_GET['order_id'] : null; }
        if (!$dishId) { $dishId = isset($_GET['dish_id']) ? $_GET['dish_id'] : null; }


        if (!$orderId || !$dishId) {
            $queryString = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
            parse_str((string)$queryString, $manualGet);
            
            if (!$orderId) { $orderId = isset($manualGet['order_id']) ? $manualGet['order_id'] : null; }
            if (!$dishId) { $dishId = isset($manualGet['dish_id']) ? $manualGet['dish_id'] : null; }
        }

        if (!$orderId || !$dishId) {
            $this->jsonResponse([
                'error' => 'Missing order_id or dish_id',
                'debug_info' => [
                    'json_body' => $input,
                    'get_array' => $_GET,
                    'raw_uri'   => $_SERVER['REQUEST_URI']
                ]
            ], 400);
        }

        $success = $this->ordersModel->updateOrderItem($orderId, $dishId, 0);

        if ($success) {
            $this->jsonResponse(['success' => true]);
        } else {
            $this->jsonResponse(['error' => 'Failed to delete dish from order'], 400);
        }
    }

}