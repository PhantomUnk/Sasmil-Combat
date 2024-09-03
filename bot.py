#!/usr/bin/python
# -*- coding: utf8 -*-
import asyncio
import os
import sys

import requests

from aiogram import Bot, Dispatcher, types
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, UserProfilePhotos, FSInputFile, ChatMember
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.client.session.aiohttp import AiohttpSession

from dotenv import load_dotenv

from DataBase import DataBase

from datetime import datetime as dt

load_dotenv()

API_TOKEN = "7456015282:AAEsVS_LyjqcWWHh1yaRU6b0Bkkadm15pP0"  # токен бота
URL = "https://phantomunk-sasmil-combat-a0fe.twc1.net"  # ссылка на сайт

bot = Bot(token=API_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()
db = DataBase()


async def checkUser(id: int, message: types.Message):
    response = requests.post(
        f"{URL}/users/checkUser/{message.from_user.id}")  # отправляем запрос на стандартные настройки пользователя
    if str(response.status_code) != "200":
        await bot.send_message(message.from_user.id, "Something went wrong. Please try later.")
        return
    return bool(response.text)


async def setUserSettings(message: types.Message):
    settingsData = {"id": str(message.from_user.id),
                    "language": 'en',
                    "theme": 1,
                    "vibrator": 10}
    response = requests.post(
        f"{URL}/users/setUserSettings/", str(settingsData))  # отправляем запрос на стандартные настройки пользователя
    if str(response.status_code) != "200":
        await bot.send_message(message.from_user.id, "Something went wrong. Please try later.")
        return


async def download_user_photo(id: int):
    user_profile_photo: UserProfilePhotos = await bot.get_user_profile_photos(id)

    if len(user_profile_photo.photos[0]) > 0:
        file = await bot.get_file(user_profile_photo.photos[0][0].file_id)
        await bot.download_file(file.file_path, f"images/user - {id} - photo.png")
        photo = FSInputFile(f"images/user - {id} - photo.png")
        await bot.send_photo(chat_id=id, photo=photo)
    else:
        print('У пользователя нет фото в профиле.')


async def register_user(message: types.Message):
    userExist = await checkUser(message.from_user.id, message)

    if message.chat.type != 'private':  # если чат не приватный - пошел нахуй
        return

    if userExist:  # если пользователь есть
        await message.reply("Go!", reply_markup=start_webapp())
        return

    startCommand = message.text  # что пользователь нам отправил?
    refId = str(startCommand[7:])  # получаем ID

    if str(refId) == "":  # если он пустой то просто регаем как обычно
        response = requests.post(
            f"{URL}/users/register/false", str(message.from_user.id))  # отправляем запрос на регистрацию
        if str(response.status_code) != "200":  # если что-то не так
            await bot.send_message(message.from_user.id, "Something went wrong. Please try later.")
            return
        await setUserSettings(message)
        await message.reply("Go!", reply_markup=start_webapp())
        return

    if str(refId) == str(message.from_user.id):  # если ID рефералки совпадает с ID'ом пользователя, то идет нахуй
        await bot.send_message(message.from_user.id, "Нельзя регистрироваться по своей же ссылке")

    userData = {
        "id": str(message.from_user.id),
        "firstName": str(message.from_user.first_name),
        "lastName": str(message.from_user.first_name),
        "refID": str(refId),
        "registerMonth": dt.now().strftime('%B'),
        "registerDay": dt.now().day,
    }
    response = requests.post(
        f"{URL}/users/register/true", str(userData))  # отправляем запрос на регистрацию

    if str(response.status_code) != "200":  # если что-то не так
        await bot.send_message(message.from_user.id, "Something went wrong. Please try later.")
        return
    await setUserSettings(message)

    await message.reply("Go!", reply_markup=start_webapp())


@dp.message()
async def start(message: types.Message):
    # await download_user_photo(message.from_user.id)

    await register_user(message)
    await setUserSettings(message)


def start_webapp() -> InlineKeyboardMarkup:  # кнопка для старта приложения
    builder = InlineKeyboardBuilder()
    builder.button(text="Let's go", web_app=WebAppInfo(url=URL))
    return builder.as_markup()


if __name__ == '__main__':
    asyncio.run(dp.start_polling(bot))  # запускаем бота
