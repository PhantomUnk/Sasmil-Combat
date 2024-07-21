#!/usr/bin/python
# -*- coding: utf8 -*-

import pymysql


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

    def viewAllDb(self) -> dict:  # смотрим всю базу данных
        try:
            with self.connection.cursor() as cursor:
                query = "SELECT * FROM users"  # выбираем всё из пользователей
                cursor.execute(query)
                rows = cursor.fetchall()  # fetchall возвращает все данные из query
                return rows
        except Exception as e:
            print("Connection refused...")
            print(e)

    def checkUser(self, id: int) -> dict:  # проверяем есть ли пользователь в БД по ID
        try:
            with self.connection.cursor() as cursor:
                query = f"SELECT EXISTS(SELECT id FROM users WHERE id = {id})"  # проверяем есть ли пользователь в БД
                cursor.execute(query)
                rows = cursor.fetchall()
                return rows[0]
        except Exception as ex:
            print("Connection refused...")
            print(ex)

    def createUser(self, data: dict) -> bool:  # создаем нового пользователя
        try:
            with self.connection.cursor() as cursor:
                query = f"INSERT INTO `sasmilcombatdb`.`users` (id, money, CPS, energy) VALUES ({data['id']}, {data['money']}, {data['CPS']}, {data['energy']});"
                cursor.execute(query)
                self.connection.commit()
                return True

        except Exception as ex:
            print("Connection refused...")
            print(ex)

    def getUserData(self, id: int) -> list:  # Берем данные пользователя по ID
        try:
            with self.connection.cursor() as cursor:
                query = f"SELECT * FROM `sasmilcombatdb`.`users` WHERE id = {id};"
                cursor.execute(query)
                rows = cursor.fetchall()
                return rows[0]

        except Exception as ex:
            print("Connection refused...")
            print(ex)

    def userClick(self, id: int, money: int, energy: int, lastPlayedTime: str) -> bool:  # обрабатываем click пользователя
        try:
            with self.connection.cursor() as cursor:
                query = f"UPDATE `sasmilcombatdb`.`users` SET money = {money} WHERE id = {id};"
                cursor.execute(query)
                self.connection.commit()

                query = f"UPDATE `sasmilcombatdb`.`users` SET energy = {energy} WHERE id = {id};"
                cursor.execute(query)
                self.connection.commit()

                query = f"UPDATE `sasmilcombatdb`.`users` SET lastPlayedTime = '{lastPlayedTime}' WHERE id = {id};"
                cursor.execute(query)
                self.connection.commit()

                return True

        except Exception as ex:
            print("Connection refused...")
            print(ex)
    def addBoost(self, id: int, boost: str) -> bool:  # добавляем BOOST'ы
        try:
            with self.connection.cursor() as cursor:
                currentBoosts = ""
                if DataBase.getUserData(id)[0]['boosts'] is not None:
                    currentBoosts = str(DataBase.getUserData(id)[0]['boosts'])
                query = f"UPDATE `sasmilcombatdb`.`users` SET boosts = '{str(boost + ',' + currentBoosts)}' WHERE id = {id};"
                cursor.execute(query)
                self.connection.commit()
                return True

        except Exception as ex:
            print("Connection refused...")
            print(ex)

    def getUserBoosts(self, id: int) -> tuple:  # получаем Boost'ы пользователя по ID
        try:
            with self.connection.cursor() as cursor:
                query = f"SELECT boosts FROM `sasmilcombatdb`.`users` WHERE id = {id};"
                cursor.execute(query)
                res = cursor.fetchall()  # записываем сюда результат из БД
                rows = res[0]['boosts'].split(',')  # разделяем Boost'ы
                rows.pop()  # удаляем последний элемент списка
                return rows

        except Exception as ex:
            print("Connection refused...")
            print(ex)

    def updateEnergy(self, id: int, energy: int) -> bool:
        try:
            with self.connection.cursor() as cursor:
                query = f"UPDATE `sasmilcombatdb`.`users` SET energy = {energy} WHERE id = {id};"
                cursor.execute(query)
                self.connection.commit()

                return True

        except Exception as ex:
            print("Connection refused...")
            print(ex)

    def energyPerSecond(self):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users")
                self.connection.commit()

                for (energy) in cursor:
                    userID = energy['id']
                    userEnergy = energy['energy']

                    if not (userEnergy > 1000):
                        DataBase.updateEnergy(userID, userEnergy + 1)
                print("Energy++")
                return True

        except Exception as ex:
            print("Connection refused...")
            print(ex)
