import json

from django.core.management.base import BaseCommand
from aiohttp import web, WSMsgType

from led.domain.leds import set_led_colors


async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        if msg.type == WSMsgType.TEXT:
            if msg.data == 'close':
                await ws.close()
            else:
                colors = json.loads(msg.data)
                set_led_colors(*colors)
        elif msg.type == WSMsgType.ERROR:
            print('ws connection closed with exception %s' %
                  ws.exception())

    print('websocket connection closed')

    return ws


class Command(BaseCommand):
    def handle(self, *args, **options):
        app = web.Application()
        app.add_routes([web.get('/ws', websocket_handler)])
        web.run_app(app)
