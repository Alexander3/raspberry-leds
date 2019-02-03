import math
from time import sleep
from unittest.mock import MagicMock

from numpy import linspace

try:
    import pigpio
except ImportError:
    print("Mocking pigpio")
    pigpio = MagicMock()
    pigpio.pi().set_PWM_dutycycle.side_effect = lambda *args: print('set', *args)

RED_PIN = 23
GREEN_PIN = 24
BLUE_PIN = 25

pi = pigpio.pi()
currentColor = 0, 0, 0


def clear():
    pi.set_PWM_dutycycle(RED_PIN, 0)
    pi.set_PWM_dutycycle(GREEN_PIN, 0)
    pi.set_PWM_dutycycle(BLUE_PIN, 0)
    pi.stop()


def sine_wave(t, f=1, phi=0):
    return round(128 * math.sin(2 * math.pi * f * t + phi) + 127)


def set_led_colors(r, g, b):
    global currentColor
    pi.set_PWM_dutycycle(RED_PIN, r)
    pi.set_PWM_dutycycle(GREEN_PIN, g)
    pi.set_PWM_dutycycle(BLUE_PIN, b)
    currentColor = r, g, b


def lerp(to, time=1):
    frequency = 30
    print(currentColor, '->', to)
    for color in linspace(list(currentColor), list(to), num=time * frequency, dtype='uint8'):
        print(*tuple(color))
        set_led_colors(*tuple(color))
        sleep(1 / (frequency - 1))
