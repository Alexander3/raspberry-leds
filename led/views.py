import json

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from led.domain.leds import lerp
from pi_led.celery import app
from .tasks import wake_me_up
from django_celery_beat.models import PeriodicTask, CrontabSchedule


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

    schedule = CrontabSchedule.objects.get(id=1)
    schedule.hour = data['hour']
    schedule.minute = data['minute']
    schedule.save()
    PeriodicTask.objects.update_or_create(
        crontab=schedule,
        name='Wake me',
        defaults=dict(
            task='led.tasks.wake_me_up',
            kwargs=json.dumps({'speed': 15 * 60}),
            one_off=True
        )
    )
    return HttpResponse()


@csrf_exempt
def wake_me_slowly(request):
    app.control.purge()
    i = app.control.inspect()
    for task in list(i.active().values())[0]:
        app.control.revoke(task['id'], terminate=True)
    app.control.purge()

    wake_me_up.delay(60 * 10)
    return HttpResponse()


@csrf_exempt
def me(request):
    return HttpResponse('This is RaspberyPi')
