from DataBase import DataBase

from time import sleep

db = DataBase()


def updateData():  # обновляем данные всех пользователей раз в секунду
    while True:
        db.energyPerSecond()  # обновляем энергию каждую секунду
        db.boostTimePerSecond()  # обновляем время буста каждую секунду
        sleep(1)
