#!/usr/bin/python
# -*- coding: utf8 -*-
import ast

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from DataBase import DataBase
import uvicorn

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

    for key, value in db.checkUser(int(data))[0].items():  # Есть ли пользователь в БД?
        isRegister = bool(value)  # Value либо 1 если есть либо 0 если нет

    if not isRegister:  # если пользователь не зарегистрирован
        defaultUserData = {"id": int(data), "money": 0, "CPS": 0, "energy": 1000}  # Записываем данные пользователя для регистрации. int(data) - ID пользователя.
        db.createUser(defaultUserData)  # создаём user'a

    return "Ok"


@app.post("/users/getUserData")
async def getUsers(request: Request):
    temp = await request.body()  # получаем данные
    data = ast.literal_eval(temp.decode('utf-8'))  # превращаем данные в string

    print(db.getUserData(int(data)))

    return db.getUserData(int(data))[0]


@app.post("/click")
async def click(request: Request):
    print("Connection!")
    temp = await request.body()
    data = ast.literal_eval(temp.decode('utf-8'))
    db.userClick(data['id'], data['money'], data['energy'])
    return f"Status : Ok"

# команда для запуска сервера - uvicorn server:app --reload
