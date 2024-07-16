#!/usr/bin/python
# -*- coding: utf8 -*-
import asyncio
import os
import sys

import requests

from aiogram import Bot, Dispatcher, types
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import WebAppInfo, InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder

from dotenv import load_dotenv

load_dotenv()

API_TOKEN = os.getenv('API_TOKEN')  # токен бота
URL = os.getenv('URL')  # ссылка на сайт

bot = Bot(token=API_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()

@dp.message()
async def start(message: types.Message):
    response = requests.post(f"{URL}/users/register", str(message.from_user.id))  # отправляем запрос на сервер

    if str(response.status_code) != "200":
        await bot.send_message(message.from_user.id, "Something went wrong. Please try later.")
        return

    await message.reply("Go!", reply_markup=start_webapp())


def start_webapp() -> InlineKeyboardMarkup:  # кнопка для старта приложения
    builder = InlineKeyboardBuilder()
    builder.button(text="Let's go", web_app=WebAppInfo(url=URL))
    return builder.as_markup()


if __name__ == '__main__':
    asyncio.run(dp.start_polling(bot))  # запускаем бота
