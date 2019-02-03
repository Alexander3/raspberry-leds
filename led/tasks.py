from time import sleep

from celery import shared_task

from led.domain.leds import lerp, set_led_colors, sine_wave


@shared_task
def wake_me_up(speed=30 * 60):
    set_led_colors(0, 0, 0)
    lerp((0x61, 0xB3, 0xFF), speed)


@shared_task
def display_wave():
    freq = 1
    for s in range(30):
        for sub in range(35):
            t = s + sub / 35
            r = sine_wave(t, f=freq, phi=0)
            g = sine_wave(t, f=freq*1.3, phi=0)
            b = sine_wave(t, f=freq*1.6, phi=0)
            set_led_colors(r, g, b)
            sleep(1 / 35)
