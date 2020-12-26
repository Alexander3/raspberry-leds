from time import sleep

from celery import shared_task

from led.domain.leds import led_strip


@shared_task
def wake_me_up(speed=30 * 60):
    led_strip.set_led_colors(0, 0, 0)
    led_strip.lerp((0x61, 0xB3, 0xFF), speed)


@shared_task
def display_wave():
    freq = 1
    for s in range(30):
        for sub in range(35):
            t = s + sub / 35
            r = led_strip.sine_wave(t, f=freq, phi=0)
            g = led_strip.sine_wave(t, f=freq*1.3, phi=0)
            b = led_strip.sine_wave(t, f=freq*1.6, phi=0)
            led_strip.set_led_colors(r, g, b)
            sleep(1 / 35)
