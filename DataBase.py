#!/usr/bin/python
# -*- coding: utf8 -*-

import pymysql
from datetime import datetime
import logging


# noinspection PyTypeChecker
class DataBase:
    def __init__(self):
        self.connection = pymysql.connect(  # настраиваем соединение
            host="localhost",
            port=3305,
            user="root",
            password="root",
            database="sasmilcombatdb",
            cursorclass=pymysql.cursors.DictCursor
        )
        self.boostTime = 5

    def _execute_query(self, query: str, params: tuple = ()) -> list:
        try:
            self.connection.connect()
            with self.connection.cursor() as cursor:
                cursor.execute(query, params)
                self.connection.close()
                return cursor.fetchall()
        except Exception as ex:
            logging.error("Connection refused...")
            logging.error(ex)
            self.connection.close()
            return ex

    def _execute_commit(self, query: str, params: tuple = ()) -> bool:
        try:
            self.connection.connect()
            with self.connection.cursor() as cursor:
                cursor.execute(query, params)
                self.connection.commit()
                self.connection.close()
                return True
        except Exception as ex:
            logging.error("Connection refused...")
            logging.error(ex)
            self.connection.close()
            return False

    def _get_last_boost_time(self, user_id: int, boost_name: str) -> datetime or None:
        result = self._execute_query(
            f"SELECT lastPurchasedTime FROM `sasmilcombatdb`.`boosts` "
            f"WHERE userID = %s AND name = %s ORDER BY lastPurchasedTime DESC LIMIT 1;",
            (user_id, boost_name))  # Берем последнюю lastPurchasedTime в бустах
        return datetime.strptime(result[0]['lastPurchasedTime'],
                                 "%Y-%m-%d %H:%M:%S.%f") if result else None  # форматируем и возвращаем если есть result иначе None

    def _can_purchase_full_energy(self, user_id: int) -> bool:
        last_purchased_time = self._get_last_boost_time(user_id, "Full Energy")
        if last_purchased_time:
            difference = (datetime.now() - last_purchased_time).total_seconds()
            return difference >= self.boostTime
        return True

    def viewAllDb(self) -> list:  # смотрим всю базу данных
        return self._execute_query("SELECT * FROM users")

    def checkUser(self, id: int) -> bool:  # проверяем есть ли пользователь в БД по ID
        return bool(self._execute_query(f"SELECT EXISTS(SELECT id FROM users WHERE id = %s)", id)[0][
                        f'EXISTS(SELECT id FROM users WHERE id = {id})'])

    def getUserBoosts(self, id: str) -> list:  # получаем Boost'ы пользователя по ID
        return self._execute_query(f"SELECT * FROM `sasmilcombatdb`.`boosts` WHERE userID = %s;", id)

    def setUserSettings(self, id: str, language: str, theme: bool, vibrator: int) -> bool:
        print(f"id = {id}; language = {language}; theme = {theme}; vibrator = {vibrator}")
        return self._execute_commit(
            f"INSERT INTO `sasmilcombatdb`.`usersettings` (userID, language, theme, vibrator) VALUES (%s, %s, %s, %s);",
            (str(id), str(language), bool(theme), int(vibrator)))  # устанавливаю настройки

    def getUserSettings(self, id: str) -> dict:
        return self._execute_query(f"SELECT * from `sasmilcombatdb`.`usersettings` where userID = %s", id)[
            -1]  # возвращаю все настройки пользователя

    def updateEnergy(self, id: int, energy: int) -> bool:  # обновляем энергию
        return self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET energy = %s WHERE id = %s;", (energy, id))

    def updateBoostTime(self, boostID: int, time: int) -> bool:  # обновляем время буста
        return self._execute_commit(f"UPDATE `sasmilcombatdb`.`boosts` SET time = %s WHERE boostID = %s;",
                                    (time, boostID))

    def userClick(self, id: str, money: int, energy: int) -> bool:  # обрабатываем click пользователя
        self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET money = %s WHERE id = %s;", (money, id))
        return self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET energy = %s WHERE id = %s;", (energy, id))

    def deleteBoost(self, boostID: int) -> bool:  # удаляем буст по его ID
        return self._execute_commit(f"DELETE FROM boosts WHERE boostID = %s", boostID)

    def getAvailableBoosts(self) -> list:
        return self._execute_query(f"SELECT * FROM sasmilcombatdb.availableboosts;")  # берем все СУЩЕСТВУЮЩИЕ бусты

    def createUser(self, id: str) -> bool:  # создаем нового пользователя
        return self._execute_commit(
            f"INSERT INTO `sasmilcombatdb`.`users` (id, money, CPS, energy, MaxEnergy) VALUES (%s, %s, %s, %s, %s);",
            (id, 0, 1, 1000, 1000))  # создаём пользователя

    def createReferalUser(self, userData: dict, userID: str):
        linkLevel = int(self._execute_query(f"SELECT linkLevel FROM `sasmilcombatdb`.`referallinks` WHERE userID = %s",
                                            userData['refID'])[0]['linkLevel'])  # узнаем уровень реферальной ссылки

        refMoney = self._execute_query(f"SELECT money FROM `sasmilcombatdb`.`users` WHERE id = %s", userData['refID'])[0]['money']  # деньги пользователя который ДАЛ реферальную ссылку

        newMoney = int(refMoney) + 5000 + (linkLevel * 2000)  # новые бабки пользователя

        self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET money = %s WHERE id = %s;",
                             (newMoney, userData['refID']))  # устанавливаем новые деньги рефереру

        self._execute_commit(f"UPDATE `sasmilcombatdb`.`referallinks` SET linkLevel = linkLevel + 1 where userID = %s",
                             userData['refID'])  # увеличиваем уровень ссылки

        self._execute_commit(
            f"INSERT INTO `sasmilcombatdb`.`referalusers` (userID, userFirstname, userLastname, refID, money, registerMonth, registerDay) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (str(userID), str(userData['firstName']), str(userData['lastName']), str(userData['refID']),
             int(5000 + linkLevel * 2000), str(userData['registerMonth']), str(userData['registerDay'])))

        return self._execute_commit(
            f"INSERT INTO `sasmilcombatdb`.`users` (id, money, CPS, energy, MaxEnergy) VALUES (%s, %s, %s, %s, %s);",
            (userID, (5000 + (linkLevel * 2000)) / 2, 1, 1000, 1000))  # создаём пользователя по рефералке

    def generateReferalLink(self, id: str, isCheck: bool) -> bool:
        if not isCheck:  # если мы не проверяем на наличие ссылки, а делаем generate
            if self._execute_query("SELECT * FROM `sasmilcombatdb`.`referallinks` WHERE userID = %s",
                                   id) == ():  # дополнительная защита от Самвела, проверяем есть ли уже существующие ссылки от пользователя
                return self._execute_commit(
                    "INSERT INTO `sasmilcombatdb`.`referallinks` (userID, linkLevel) VALUES (%s, %s)",
                    (id, 1))  # генерим
        if self._execute_query("SELECT * FROM `sasmilcombatdb`.`referallinks` WHERE userID = %s",
                                   id) != ():  # если тут что-то есть, то возвращаем True, и ее генерить не надо
            return True
        return False

    def getReferalFriends(self, id: str) -> list:
        friends = self._execute_query("SELECT * FROM `sasmilcombatdb`.`referalusers` where refID = %s", id)

        return friends

    def getUserData(self, id: str) -> dict:  # Берем данные пользователя по ID
        userData = self._execute_query(f"SELECT * FROM `sasmilcombatdb`.`users` WHERE id = %s;",
                                       id)[0]  # получаем данные

        last_purchased_time = self._get_last_boost_time(id, "Full Energy")  # берем последнее время покупки Full Energy

        userData['Full_Energy'] = (
                last_purchased_time is None or
                (datetime.now() - last_purchased_time).total_seconds() >= self.boostTime
        )  # Если last_purchased_time нет или есть, но КД не прошло тогда записываем в userData

        return userData

    def addBoost(self, boostData: dict) -> bool:  # добавляем BOOST'ы
        userMoney = int(self._execute_query(f'SELECT money FROM users where id = %s', boostData['id'])[0][
                            'money'])  # текущие деньги пользователя
        if userMoney < int(boostData['price']):  # если денег меньше чем цена буста
            return False
        newUserMoney = userMoney - int(boostData['price'])  # новые бабки пользователя

        if boostData['name'] == "Energy Limit":  # если буст такой
            self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET MaxEnergy = MaxEnergy + 1000 WHERE id = %s;",
                                 boostData['id'])  # MaxEnergy = MaxEnergy + 1000
            self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET energy = MaxEnergy WHERE id = %s;",
                                 boostData['id'])  # energy = MaxEnergy

        elif boostData['name'] == "MultiTap":
            self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET CPS = CPS + 1 WHERE id = %s;",
                                 boostData['id'])  # CPS += 1
        elif boostData['name'] == "Null Boost":
            self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET money = %s WHERE id = %s;", (50000, 11))
            self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET CPS = %s WHERE id = %s;", (1, 11))
            self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET CPS = %s WHERE id = %s;", (1, 11))
            self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET energy = %s WHERE id = %s;", (1000, 11))
            self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET MaxEnergy = %s WHERE id = %s;", (1000, 11))
            self._execute_commit(f"TRUNCATE `sasmilcombatdb`.`boosts`")

        elif boostData['name'] == "Full Energy":
            if not self._can_purchase_full_energy(id):
                return False
            self._execute_commit(f"UPDATE `sasmilcombatdb`.`users` SET energy = MaxEnergy WHERE id = %s;",
                                 boostData['id'])  # восстанавливаем полностью энергию

        self._execute_commit(f'UPDATE `sasmilcombatdb`.`users` SET money = %s WHERE id = %s;',
                             (newUserMoney, boostData['id']))  # убавляем бабки пользователя

        return self._execute_commit(
            f'INSERT INTO `sasmilcombatdb`.`boosts` (`userID`, `name`, `time`, `lastPurchasedTime`) VALUES (%s, %s, %s, %s)',
            (boostData['id'], str(boostData['name']), str(boostData['time']),
             str(datetime.now())))  # добавляем буст пользователю

    def energyPerSecond(self) -> None:  # обновляем энергию каждую секунду (Зависим от updateEnergy)
        data = self._execute_query("SELECT * FROM users")  # выбираем всё из user'ов
        for (user) in data:  # для каждого user'а во всех user'ах
            userID = user['id']  # ID user'а
            userEnergy = user['energy']  # Энергия user'а
            maxUserEnergy = user['MaxEnergy']  # Максимальная энергия user'а

            if userEnergy < maxUserEnergy:  # проверяем можем ли мы добавлять энергию
                DataBase.updateEnergy(self, userID, userEnergy + 1)  # если да, то добавляем

        # print("Energy++")

    def boostTimePerSecond(self) -> None:  # обновляем время бустов каждую секунду (Зависим от updateBoostTime)
        # всё тоже, самое что и в energyPerSecond
        boosts = self._execute_query("SELECT * FROM boosts")
        for (user) in boosts:
            userTime = str(user['time'])
            boostID = user['boostID']

            if (userTime == '0') and (userTime != 'infinity'):
                DataBase.deleteBoost(self, boostID)

            if (userTime != '0') and (userTime != 'infinity'):
                DataBase.updateBoostTime(self, boostID, int(userTime) - 1)
                print("Boost--")
# db = DataBase()

# print(db.checkUser(11))
