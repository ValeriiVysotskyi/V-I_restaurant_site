<?php

require_once __DIR__ . '/../dal/DishDal.php';


class DishModel
{
    private $dishDal;

    public function __construct(DishDal $dishDal) {
        $this->dishDal = $dishDal;
    }

    public function createDish($dish) {
        return $this->dishDal->insert($dish);
    }

    public function updateDish($dish) {
        if (!isset($dish['id'])) {
            throw new InvalidArgumentException('Dish id is required.');
        }

        $dishId = $dish['id'];
        unset($dish['id']);

        return $this->dishDal->update($dishId, $dish);
    }

    public function deleteDish($dishId) {
        return $this->dishDal->delete($dishId);
    }
}