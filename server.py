#!/usr/bin/python
# -*- coding: utf8 -*-
import ast
import uvicorn
import os

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from threading import Thread

from DataBase import DataBase
from update import updateData

db = DataBase()
app = FastAPI()  # приложение
templates = Jinja2Templates(directory=r"web")  # наши шаблоны
app.mount("/static", StaticFiles(directory=r"/web/static"), name="static")  # монтируем статические компоненты
origins = ["*"]
# noinspection PyTypeChecker
app.add_middleware(  # чтобы CORS работал
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

energyThread = Thread(
    target=updateData).start()  # создаём новый поток, чтобы сервер мог одновременно выполнять действия


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(name="index.html", request=request)  # возвращаем сам сайт


@app.get("/users/getAllUsers")
async def getUsers():
    return db.viewAllDb()  # возвращаем всю БД


# @app.get("/favicon.ico")
# async def getUsers():
#     return "db.viewAllDb()"  # возвращаем всю БД


@app.post("/users/register/{isReferal}")  # регистрируем пользователя
async def registerUser(request: Request, isReferal: bool):
    temp = await request.body()  # получаем данные
    userData = ast.literal_eval(temp.decode('utf-8'))  # превращаем данные в string

    db.createUser(str(userData)) if not isReferal else db.createReferalUser(userData, userData[
        'id'])  # создаем обычного юзера если не по рефералке и реферального если по ней


# @app.post("/users/register/{userID}/{refID}/{isReferal}")  # регистрируем пользователя
# async def registerUser(userID: str, refID: str, isReferal: bool):
#    db.createUser(userID) if not isReferal else db.createReferalUser(refID, userID)  # создаем обычного юзера если не по рефералке и реферального если по ней


@app.post("/users/getUserData/{id}")
async def getUsers(id: str):
    return db.getUserData(id)


@app.post("/click")
async def click(userData: dict):
    return db.userClick(str(userData['id']), userData['money'], userData['energy'])  # отправляем запрос о клике в БД


@app.post("/boosts/buyBoost")
async def buyBoost(boostData: dict):
    return db.addBoost(boostData)  # Добавляем Буст


@app.get("/boosts/getAvailableBoosts")
async def getAvailableBoosts():
    return db.getAvailableBoosts()


@app.post("/boosts/getUserBoosts/{id}")
async def getUsers(id: str):
    return db.getUserBoosts(id)


# @app.post("/users/setUserSettings/")
# async def setUserSettings(settingsData: dict):
#     a = await settingsData
#     print(a)
#     # return db.setUserSettings(str(settingsData['id']), settingsData['language'], settingsData['theme'],
#     #                           settingsData['vibrator'])

@app.post("/users/setUserSettings/")
async def setUserSettings(request: Request):
    temp = await request.body()  # получаем данные
    settingsData = ast.literal_eval(temp.decode('utf-8'))  # превращаем данные в string
    return db.setUserSettings(str(settingsData['id']), settingsData['language'], settingsData['theme'],
                              settingsData['vibrator'])


@app.post("/users/getUserSettings/{id}")
async def getUserSettings(id: str):
    return db.getUserSettings(id)


@app.post("/users/generateRefLink/{id}/{isCheck}")
async def getUserSettings(id: str, isCheck: bool):
    return db.generateReferalLink(id, isCheck)


@app.post("/users/getReferalFriends/{id}")
async def getReferalFriends(id: str):
    return db.getReferalFriends(id)


# if __name__ == '__main__':
#     uvicorn.run(port=8000, app=app)
#     exec(open('bot.py').read())

# команда для запуска сервера - uvicorn server:app --reload
