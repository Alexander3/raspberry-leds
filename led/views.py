import json

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from led.domain.leds import set_led_colors, lerp


@csrf_exempt
def set_color(request):
    data = json.loads(request.body.decode())

    hexcolor = data['color'].lstrip('#')
    rgb = tuple(int(hexcolor[i:i + 2], 16) for i in (0, 2, 4))
    lerp(rgb, 1)
    return HttpResponse()


@csrf_exempt
def set_alarm(request):
    data = json.loads(request.body.decode())

    hexcolor = data['color'].lstrip('#')
    rgb = tuple(int(hexcolor[i:i + 2], 16) for i in (0, 2, 4))
    lerp(rgb, 1)
    return HttpResponse()


@csrf_exempt
def me(request):
    return HttpResponse('This is RaspberyPi')
