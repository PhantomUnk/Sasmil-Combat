#!/usr/bin/python
# -*- coding: utf8 -*-

import pymysql


class DataBase:
    @staticmethod
    def viewAllDb() -> tuple:  # смотрим всю базу данных
        try:
            connection = pymysql.connect(
                host="localhost",
                port=3305,
                user="root",
                password="root",
                database="sasmilcombatdb",
                cursorclass=pymysql.cursors.DictCursor
            )
            print("successfully connected...")
            try:
                with connection.cursor() as cursor:
                    query = "SELECT * FROM users"
                    cursor.execute(query)
                    rows = cursor.fetchall()  # fetchall возвращает все данные из таблицы
                    return rows
            finally:
                connection.close()

        except Exception as ex:
            print("Connection refused...")
            print(ex)

    @staticmethod
    def checkUser(id: int) -> tuple:  # проверяем есть ли пользователь в БД по ID
        try:
            connection = pymysql.connect(
                host="localhost",
                port=3305,
                user="root",
                password="root",
                database="sasmilcombatdb",
                cursorclass=pymysql.cursors.DictCursor
            )
            print("successfully connected...")
            try:
                with connection.cursor() as cursor:
                    query = f"SELECT EXISTS(SELECT id FROM users WHERE id = {id})"
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    return rows
            finally:
                connection.close()

        except Exception as ex:
            print("Connection refused...")
            print(ex)

    @staticmethod
    def createUser(data: dict) -> bool:  # создаем нового пользователя
        try:
            connection = pymysql.connect(
                host="localhost",
                port=3305,
                user="root",
                password="root",
                database="sasmilcombatdb",
                cursorclass=pymysql.cursors.DictCursor
            )
            print("successfully connected...")
            try:
                with connection.cursor() as cursor:
                    query = f"INSERT INTO `sasmilcombatdb`.`users` (id, money, CPS, energy) VALUES ({data['id']}, {data['money']}, {data['CPS']}, {data['energy']});"
                    cursor.execute(query)
                    connection.commit()
                    return True
            finally:
                connection.close()

        except Exception as ex:
            print("Connection refused...")
            print(ex)
