from celery import shared_task

from led.domain.leds import lerp, set_led_colors


@shared_task
def wake_me_up(speed=30 * 60):
    set_led_colors(0, 0, 0)
    lerp((0x61, 0xB3, 0xFF), speed)
