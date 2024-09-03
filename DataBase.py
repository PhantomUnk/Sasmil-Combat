#!/usr/bin/python
# -*- coding: utf8 -*-

import sqlite3
from datetime import datetime
import logging


# noinspection PyTypeChecker
class DataBase:
    def __init__(self):
        self.connection = sqlite3.connect('database.db', check_same_thread=False)
        self.connection.row_factory = sqlite3.Row  # Чтобы результат был в виде словарей
        self.boostTime = 7200

    def _execute_query(self, query: str, params: tuple = ()) -> list:
        try:
            with self.connection as conn:
                cursor = conn.cursor()
                cursor.execute(query, params)
                return [dict(row) for row in cursor.fetchall()]  # Преобразуем результат в список словарей
        except Exception as ex:
            logging.error("Query execution failed...")
            logging.error(ex)
            return []

    def _execute_commit(self, query: str, params: tuple = ()) -> bool:
        try:
            with self.connection as conn:
                cursor = conn.cursor()
                cursor.execute(query, params)
                conn.commit()
                return True
        except Exception as ex:
            logging.error("Commit execution failed...")
            logging.error(ex)
            return False

    def _get_last_boost_time(self, user_id: int, boost_name: str) -> datetime or None:
        result = self._execute_query(
            "SELECT lastPurchasedTime FROM boosts WHERE userID = ? AND name = ? "
            "ORDER BY lastPurchasedTime DESC LIMIT 1;",
            (user_id, boost_name)
        )
        return datetime.strptime(result[0]['lastPurchasedTime'], "%Y-%m-%d %H:%M:%S.%f") if result else None

    def _can_purchase_full_energy(self, user_id: int) -> bool:
        last_purchased_time = self._get_last_boost_time(user_id, "Full Energy")
        if last_purchased_time:
            difference = (datetime.now() - last_purchased_time).total_seconds()
            return difference >= self.boostTime
        return True

    def viewAllDb(self) -> list:  # смотрим всю базу данных
        return self._execute_query("SELECT * FROM users")

    def checkUser(self, id: int) -> bool:  # проверяем есть ли пользователь в БД по ID
        result = self._execute_query("SELECT EXISTS(SELECT id FROM users WHERE id = ?)", (id,))
        return bool(result[0]['EXISTS(SELECT id FROM users WHERE id = ?)'])

    def getUserBoosts(self, id: str) -> list:  # получаем Boost'ы пользователя по ID
        return self._execute_query(f"SELECT * FROM boosts WHERE userID = ?;", (id,))

    def setUserSettings(self, id: str, language: str, theme: bool, vibrator: int) -> bool:
        return self._execute_commit(
            "INSERT INTO usersettings (userID, language, theme, vibrator) VALUES (?, ?, ?, ?);",
            (id, language, theme, vibrator)
        )

    def getUserSettings(self, id: str) -> dict:
        result = self._execute_query("SELECT * from usersettings where userID = ?", (id,))
        return result[-1] if result else {}

    def updateEnergy(self, id: int, energy: int) -> bool:
        return self._execute_commit("UPDATE users SET energy = ? WHERE id = ?;", (energy, id))

    def updateBoostTime(self, boostID: int, time: int) -> bool:
        return self._execute_commit("UPDATE boosts SET time = ? WHERE boostID = ?;", (time, boostID))

    def userClick(self, id: str, money: int, energy: int) -> bool:
        self._execute_commit("UPDATE users SET money = ? WHERE id = ?;", (money, id))
        return self._execute_commit("UPDATE users SET energy = ? WHERE id = ?;", (energy, id))

    def deleteBoost(self, boostID: int) -> bool:
        return self._execute_commit("DELETE FROM boosts WHERE boostID = ?", (boostID,))

    def getAvailableBoosts(self) -> list:
        return self._execute_query("SELECT * FROM availableboosts;")

    def createUser(self, id: str) -> bool:
        return self._execute_commit(
            "INSERT INTO users (id, money, CPS, energy, MaxEnergy) VALUES (?, ?, ?, ?, ?);",
            (id, 0, 1, 1000, 1000)
        )

    def createReferalUser(self, userData: dict, userID: str):
        linkLevel = int(self._execute_query(
            "SELECT linkLevel FROM referallinks WHERE userID = ?", (userData['refID'],))[0]['linkLevel'])

        refMoney = self._execute_query(
            "SELECT money FROM users WHERE id = ?", (userData['refID'],))[0]['money']

        newMoney = int(refMoney) + 5000 + (linkLevel * 2000)

        self._execute_commit("UPDATE users SET money = ? WHERE id = ?;", (newMoney, userData['refID']))
        self._execute_commit(
            "UPDATE referallinks SET linkLevel = linkLevel + 1 where userID = ?", (userData['refID'],))
        self._execute_commit(
            "INSERT INTO referalusers (userID, userFirstname, userLastname, refID, money, registerMonth, registerDay) "
            "VALUES (?, ?, ?, ?, ?, ?, ?);",
            (userID, userData['firstName'], userData['lastName'], userData['refID'],
             5000 + linkLevel * 2000, userData['registerMonth'], userData['registerDay'])
        )
        return self.createUser(userID)

    def generateReferalLink(self, id: str, isCheck: bool) -> bool:
        if not isCheck:
            if not self._execute_query("SELECT * FROM referallinks WHERE userID = ?", (id,)):
                return self._execute_commit("INSERT INTO referallinks (userID, linkLevel) VALUES (?, ?)", (id, 1))
        return bool(self._execute_query("SELECT * FROM referallinks WHERE userID = ?", (id,)))

    def getReferalFriends(self, id: str) -> list:
        return self._execute_query("SELECT * FROM referalusers where refID = ?", (id,))

    def getUserData(self, id: str) -> dict:
        userData = self._execute_query("SELECT * FROM users WHERE id = ?", (id,))[0]

        last_purchased_time = self._get_last_boost_time(id, "Full Energy")
        userData['Full_Energy'] = (
                last_purchased_time is None or
                (datetime.now() - last_purchased_time).total_seconds() >= self.boostTime
        )
        return userData

    def addBoost(self, boostData: dict) -> bool:  # добавляем BOOST'ы
        # Текущие деньги пользователя
        userMoney = int(self._execute_query('SELECT money FROM users where id = ?', (boostData['id'],))[0]['money'])

        # Проверяем, хватает ли денег на покупку буста
        if userMoney < int(boostData['price']):
            return False

        newUserMoney = userMoney - int(boostData['price'])  # Обновляем деньги пользователя

        if boostData['name'] == "Energy Limit":  # Если буст типа "Energy Limit"
            self._execute_commit("UPDATE users SET MaxEnergy = MaxEnergy + 1000 WHERE id = ?;", (boostData['id'],))
            self._execute_commit("UPDATE users SET energy = MaxEnergy WHERE id = ?;", (boostData['id'],))

        elif boostData['name'] == "MultiTap":
            self._execute_commit("UPDATE users SET CPS = CPS + 1 WHERE id = ?;", (boostData['id'],))

        elif boostData['name'] == "Null Boost":
            self._execute_commit("UPDATE users SET money = ? WHERE id = ?;", (50000, '11'))
            self._execute_commit("UPDATE users SET CPS = ? WHERE id = ?;", (1, '11'))
            self._execute_commit("UPDATE users SET energy = ? WHERE id = ?;", (1000, '11'))
            self._execute_commit("UPDATE users SET MaxEnergy = ? WHERE id = ?;", (1000, '11'))
            self._execute_commit("DELETE FROM boosts")

        elif boostData['name'] == "Full Energy":
            if not self._can_purchase_full_energy(boostData['id']):
                return False
            self._execute_commit("UPDATE users SET energy = MaxEnergy WHERE id = ?;", (boostData['id'],))

        # Обновляем деньги пользователя после покупки буста
        self._execute_commit('UPDATE users SET money = ? WHERE id = ?;', (newUserMoney, boostData['id']))

        # Вставляем запись о бусте в таблицу boosts
        return self._execute_commit(
            'INSERT INTO boosts (userID, name, time, lastPurchasedTime) VALUES (?, ?, ?, ?)',
            (boostData['id'], boostData['name'], boostData['time'], datetime.now())
        )

    def energyPerSecond(self) -> None:
        data = self._execute_query("SELECT * FROM users")
        for user in data:
            userID = user['id']
            userEnergy = user['energy']
            maxUserEnergy = user['MaxEnergy']

            if userEnergy < maxUserEnergy:
                self.updateEnergy(userID, userEnergy + 1)

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
