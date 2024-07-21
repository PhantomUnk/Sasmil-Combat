#!/usr/bin/python
# -*- coding: utf8 -*-
import ast
from time import sleep

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from DataBase import DataBase
import uvicorn
from threading import Thread
from datetime import datetime

db = DataBase()
app = FastAPI()  # приложение
templates = Jinja2Templates(directory=r"web")  # наши шаблоны
app.mount("/static", StaticFiles(directory=r".\web\static"), name="static")  # монтируем статические компоненты
origins = ["*"]
app.add_middleware(  # чтобы CORS работал
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def updateEnergy():  # обновляем энергию всех пользователей раз в секунду
    while True:
        db.energyPerSecond()
        sleep(1)


#energyThread = Thread(target=updateEnergy).start()  # создаём новый поток, чтобы сервер мог одновременно выполнять действия


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    print("Connection!")
    return templates.TemplateResponse(name="index.html", request=request)  # возвращаем сам сайт


@app.get("/users/getAllUsers")
async def getUsers(request: Request):
    print("Connection!")
    return db.viewAllDb()  # возвращаем всю БД


@app.post("/users/register")  # регистрируем пользователя
async def registerUser(request: Request):
    isRegister = False  # зарегистрирован ли пользователь?
    temp = await request.body()  # получаем данные
    data = ast.literal_eval(temp.decode('utf-8'))  # превращаем данные в string

    for key, value in db.checkUser(int(data)).items():  # Есть ли пользователь в БД?
        isRegister = bool(value)  # Value либо 1 если есть либо 0 если нет

    if not isRegister:  # если пользователь не зарегистрирован
        defaultUserData = {"id": int(data), "money": 0, "CPS": 0,
                           "energy": 1000}  # Записываем данные пользователя для регистрации. int(data) - ID пользователя.
        db.createUser(defaultUserData)  # создаём user'a

    return "Ok"


@app.post("/users/getUserData")
async def getUsers(request: Request):
    temp = await request.body()  # получаем данные
    data = ast.literal_eval(temp.decode('utf-8'))  # превращаем данные в string

    userData = db.getUserData(int(data))  # данные пользователя
    print(userData)

    lastDate = datetime.strptime(str(userData['LastPlayedTime']),
                                 "%Y-%m-%d %H:%M:%S.%f")  # последнее время когда пользователь зашел
    currentDate = datetime.now().replace(microsecond=0)  # текущее время

    difference = (currentDate - lastDate).total_seconds()  # разница между временами

    accumulatedEnergy = int(str(difference).rpartition(".")[0])  # энергия, которая накопилась за время отсутствия

    if accumulatedEnergy > (1000 - userData['energy']):  # проверяем есть ли место, чтобы добавить энергию
        db.updateEnergy(userData['id'], 1000)  # устанавливаем энергию на 1000
    else:
        db.updateEnergy(userData['id'], int(accumulatedEnergy + userData['energy']))  # добавляем к существующей энергии накопленную

    return db.getUserData(int(data))


@app.post("/click")
async def click(request: Request):
    print("Connection!")
    temp = await request.body()  # получаем запрос
    data = ast.literal_eval(temp.decode('utf-8'))  # конвертим в нормальный стринг
    currentTime = datetime.now()  # получаем текущее время
    db.userClick(data['id'], data['money'], data['energy'], str(currentTime))  # отправляем запрос о клике в БД

    return f"Status : Ok"


@app.post("/buy/boost")
async def buyBoost(request: Request):
    temp = await request.body()  # получаем данные
    data = ast.literal_eval(temp.decode('utf-8'))  # превращаем данные в string

    db.addBoost(data['id'], data['name'])  # Добавляем Буст


@app.post("/users/getUserBoosts")
async def getUsers(request: Request):
    temp = await request.body()  # получаем данные
    data = ast.literal_eval(temp.decode('utf-8'))  # превращаем данные в string

    return db.getUserBoosts(int(data))


# команда для запуска сервера - uvicorn server:app --reload
