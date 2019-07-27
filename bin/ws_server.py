import json

from aiohttp import web, WSMsgType

from led.domain.leds import set_led_colors


async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        if msg.type == WSMsgType.TEXT:
            if msg.data == 'close':
                await ws.close()
            if msg.data.startswith('#'):
                h = msg.data.lstrip('#')
                rgb = tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
                set_led_colors(*rgb)
            else:
                colors = json.loads(msg.data)
                set_led_colors(*colors)
        elif msg.type == WSMsgType.ERROR:
            print('ws connection closed with exception %s' %
                  ws.exception())
    return ws


app = web.Application()
app.add_routes([web.get('/ws', websocket_handler)])
web.run_app(app)
