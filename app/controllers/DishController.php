<?php

class DishController {
    private $dishModel;

    public function __construct() {
        $db = DbConnect::connect();
        $dal = new DishDal($db);
        $this->dishModel = new DishModel($dal);
    }

    private function jsonResponse($data, $statusCode = 200) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public function get() {
        $categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;
        
        $dishes = $this->dishModel->getDishesByCategoryId($categoryId);

        if (!$dishes) {
            $dishes = [];
        }

        $this->jsonResponse($dishes);
    }


    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            $this->jsonResponse(['error' => 'Invalid JSON data'], 400);
        }

        $newId = $this->dishModel->createDish($input);

        $this->jsonResponse(['success' => true, 'id' => $newId], 201);
    }

    public function update() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            $this->jsonResponse(['error' => 'Invalid JSON data'], 400);
        }

        try {
            $success = $this->dishModel->updateDish($input);
            $this->jsonResponse(['success' => $success]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 400);
        }
    }

    public function delete($id) {
            if (!$id) {
                $this->jsonResponse(['error' => 'Dish ID is required'], 400);
            }

            $success = $this->dishModel->deleteDish($id);
            
            if ($success) {
                $this->jsonResponse(['success' => true]);
            } else {
                $this->jsonResponse(['error' => 'Dish not found or already deleted'], 404);
            }
        }

    public function uploadImage() {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            $this->jsonResponse(['error' => 'Failed to upload file.'], 400);
        }

        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileSize = $_FILES['image']['size'];

        if ($fileSize > 5 * 1024 * 1024) {
            $this->jsonResponse(['error' => 'File size exceeds 5MB limit.'], 400);
        }


        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($fileTmpPath);

        $allowedMimeTypes = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp'
        ];

        if (!array_key_exists($mimeType, $allowedMimeTypes)) {
            $this->jsonResponse(['error' => 'Invalid file type. Only JPG, PNG, and WEBP are allowed.'], 400);
        }

        if (!empty($_POST['old_image_path'])) {
            $this->removePhysicalFile($_POST['old_image_path']);
        }

        $extension = $allowedMimeTypes[$mimeType];
        $newFileName = uniqid('dish_', true) . '.' . $extension;

        $uploadDir = __DIR__ . '/../../assets/images/dishes/';
        $destPath = $uploadDir . $newFileName;
        
        $returnPath = './assets/images/dishes/' . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $this->jsonResponse([
                'success' => true,
                'path' => $returnPath
            ]);
        } else {
            $this->jsonResponse(['error' => 'There was an error moving the uploaded file.'], 500);
        }
    }

    private function removePhysicalFile($dbPath) {
        if (empty($dbPath)) return;
        
        $fileName = basename($dbPath);
        $absolutePath = __DIR__ . '/../../assets/images/dishes/' . $fileName;
        
        if (file_exists($absolutePath) && is_file($absolutePath)) {
            unlink($absolutePath);
        }
    }
}